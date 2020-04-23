import { Router } from 'express';
import db from 'models';
import client from 'config/redis';

const router = new Router();
const Op = db.Sequelize.Op;

router.get('/', async (req, res) => {
  const { limit, offset } = req.query;
  const user = await db.User.findByPk(req.user.id);
  let [count, channels] = await Promise.all([user.countChannels(), user.getChannels({ raw: true, limit, offset })]);

  channels = channels.map((channel) => ({
    ...channel,
    // TODO: calulate misscount for channel
    missCount: Math.floor(Math.random() * 100),
  }));
  return res.json({ count, data: channels });
});

router.get('/:channelId', async (req, res) => {
  const { channelId } = req.params;
  const channel = await db.Channel.findByPk(channelId);
  if (!channel) return res.status(404).send(`Can not find channel`);
  return res.json({
    ...channel.dataValues,
    // TODO: calculate missCount for channel
    missCount: Math.floor(Math.random() * 100),
  });
});

router.get('/:channelId/users', async (req, res) => {
  const { channelId } = req.params;
  const { limit, offset } = req.body;
  const channel = await db.Channel.findByPk(channelId);
  if (!channel) return res.status(404).send(`Can not find channel`);
  const [count, users] = await Promise.all([channel.countUsers(), channel.getUsers({ limit, offset })]);
  return res.json({ count, data: users });
});

const getChannelUser = async (req) => {
  const { userId } = req.body;
  const { channelId } = req.params;
  const [channel, user] = await Promise.all([db.Channel.findByPk(channelId), db.User.findByPk(userId)]);
  return [channel, user];
};

router.post('/:channelId/users', async (req, res) => {
  const [channel, user] = await getChannelUser(req);
  if (!user || !channel) {
    return res.status(404).send('Can not find channel or user');
  }
  await channel.addUser(user);
  return res.json({ channelId: channel.id, userId: user.id });
});

router.delete('/:channelId/users', async (req, res) => {
  const [channel, user] = await getChannelUser(req);
  if (!user || !channel) {
    return res.status(404).send('Can not find channel or user');
  }
  await channel.removeUser(user);
  return res.sendStatus(204);
});

router.get('/:channelId/threads', async (req, res) => {
  const { channelId } = req.params;
  const { limit, offset, status, title, sort } = req.query;
  const channel = await db.Channel.findByPk(channelId);
  if (!channel) res.status(404).send('Can not find channel');

  let where = {};
  if (title) {
    where = {
      ...where,
      [Op.and]: [
        db.Sequelize.where(db.Sequelize.fn('lower', db.Sequelize.col('title')), {
          [Op.like]: '%' + title.toLowerCase() + '%',
        }),
      ],
    };
  }
  if (status) where = { ...where, status };

  let order = [['updatedAt', 'desc']];

  if (sort) {
    order = [];
    const sortCondition = sort.split(',');
    sortCondition.forEach((element) => {
      const [field, atr] = element.split('_');
      order.push([field, atr]);
    });
  }

  let [count, threads] = await Promise.all([
    channel.countThreads({ where, order }),
    channel.getThreads({ raw: true, where, order, limit, offset }),
  ]);

  threads = await Promise.all(
    threads.map(async (thread) => {
      const threadInfo = JSON.parse(await client.getAsync(`threadInfo:${thread.id}`));
      return { ...thread, ...threadInfo };
    }),
  );

  let lastMessages = threads.filter((thread) => thread.lastMessage).map((thread) => thread.lastMessage);

  const customersIdList = [...new Set(lastMessages.map((msg) => msg.customerId))];

  const customers = await db.Customer.findAll({
    where: { id: { [Op.in]: customersIdList } },
  });

  lastMessages = lastMessages.map((msg) => ({
    ...msg,
    customer: customers.find((el) => el.id === msg.customerId),
  }));

  threads = threads.map((thread) => {
    return thread.lastMessage
      ? {
          ...thread,
          lastMessage: lastMessages.find((el) => el.mid === thread.lastMessage.mid),
        }
      : thread;
  });
  return res.json({ count, data: threads });
});

export default router;