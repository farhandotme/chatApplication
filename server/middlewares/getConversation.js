const { conversationModel } = require("../models/conversationModel");

const getconversation = async (currentUserId) => {
  if (!currentUserId || currentUserId === "") {
    return [];
  }

  const currentUserConversation = await conversationModel
    .find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("receiver");

  if (!currentUserConversation || !Array.isArray(currentUserConversation)) {
    return [];
  }

  const conversation = currentUserConversation.map((conv) => {
    const countUnSeenMsg = conv?.messages?.reduce(
      (prev, curr) => prev + (curr.seen ? 0 : 1),
      0
    );
    return {
      _id: conv?._id,
      sender: conv?.sender,
      receiver: conv?.receiver,
      unSeenMsg: countUnSeenMsg,
      lastMsg: conv?.messages[conv?.messages?.length - 1],
    };
  });

  return conversation;
};

module.exports = getconversation;
