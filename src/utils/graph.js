import axios from "axios";
import { GRAPH_FB_URL } from "constants";

export const getCommentAttachmentData = async (commentId, accessToken) =>
  axios
    .get(
      `${GRAPH_FB_URL}/${commentId}?fields=attachment&access_token=${accessToken}`
    )
    .then((res) => res.data)
    .catch(() => ({ attachment: null }));

export const getUserProfileFB = (userId, accessToken) =>
  axios
    .get(
      `${GRAPH_FB_URL}/${userId}?fields=name,picture.width(720)&access_token=${accessToken}`
    )
    .then((res) => res.data)
    .catch(() => ({ name: userId, picture: { data: { url: null } } }));

export const getPostInformation = (fbPostId, accessToken) =>
  axios({
    url: `${GRAPH_FB_URL}/${fbPostId}`,
    params: {
      fields:
        "attachments,message,created_time,type,source,link,updated_time,from,permalink_url",
      access_token: accessToken,
    },
  }).then((res) => res.data);

export const sendMessenger = (formData, accessToken) =>
  axios
    .post(`${GRAPH_FB_URL}/me/messages?access_token=${accessToken}`, formData, {
      headers: formData.getHeaders(),
    })
    .then((res) => {
      return { success: true, response: res.data };
    })
    .catch((err) => {
      return {
        success: false,
        response: err.response ? err.response.data.error : err,
      };
    });

export const postComment = (formData, target, accessToken) =>
  axios
    .post(
      `${GRAPH_FB_URL}/${target}/comments?access_token=${accessToken}`,
      formData,
      { headers: formData.getHeaders() }
    )
    .then((res) => {
      if (res.data.error) throw new Error(res.data.error);
      return { success: true, response: res.data };
    })
    .catch((err) => ({
      success: false,
      response: err,
    }));

export const loadMessage = (mid, fields, accessToken) =>
  axios
    .get(
      `${GRAPH_FB_URL}/${mid}?access_token=${accessToken}&fields=${fields.join(
        ","
      )}`
    )
    .then((res) => res.data);

export const loadChannel = (id, fields, accessToken) =>
  axios
    .get(
      `${GRAPH_FB_URL}/${id}?access_token=${accessToken}&fields=${fields.join(
        ","
      )}`
    )
    .then((res) => res.data);
