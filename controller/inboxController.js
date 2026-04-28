// external imports
const createError = require("http-errors");
// internal imports
const User = require("../models/Peoples");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");

// get inbox page
async function getInbox(req, res, next) {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversations;
    res.render("inbox");
  } catch (err) {
    next(err);
  }
}

// search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(escape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
  const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar",
      );

      res.json(users);
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// get messages of a conversation
async function getMessages(req, res, next) {
  try {
    // Verify that the user is authorized to access this conversation
    const conversation = await Conversation.findById(
      req.params.conversation_id,
    );

    if (!conversation) {
      return res.status(404).json({
        errors: {
          common: {
            msg: "Conversation not found!",
          },
        },
      });
    }

    // Check if the requesting user is either creator or participant
    const userId = req.user.userid ? req.user.userid.toString() : "";
    const creatorId = conversation.creator.id
      ? conversation.creator.id.toString()
      : "";
    const participantId = conversation.participant.id
      ? conversation.participant.id.toString()
      : "";

    const isAuthorized = userId === creatorId || userId === participantId;

    if (!isAuthorized) {
      return res.status(403).json({
        errors: {
          common: {
            msg: "You are not authorized to view this conversation!",
          },
        },
      });
    }

    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = conversation;

    // Convert ObjectIds to strings for frontend comparison
    const messagesWithStringIds = messages.map((message) => ({
      ...message.toObject(),
      sender: {
        ...message.sender,
        id: message.sender.id.toString(),
      },
      receiver: {
        ...message.receiver,
        id: message.receiver.id.toString(),
      },
    }));

    res.status(200).json({
      data: {
        messages: messagesWithStringIds,
        participant: {
          ...participant,
          id: participant.id.toString(),
        },
      },
      user: req.user.userid.toString(),
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

// send new message
async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // Verify that the user is authorized to send message in this conversation
      const conversation = await Conversation.findById(req.body.conversationId);

      if (!conversation) {
        return res.status(404).json({
          errors: {
            common: {
              msg: "Conversation not found!",
            },
          },
        });
      }

      // Check if the requesting user is either creator or participant
      const userId = req.user.userid ? req.user.userid.toString() : "";
      const creatorId = conversation.creator.id
        ? conversation.creator.id.toString()
        : "";
      const participantId = conversation.participant.id
        ? conversation.participant.id.toString()
        : "";

      const isAuthorized = userId === creatorId || userId === participantId;

      if (!isAuthorized) {
        return res.status(403).json({
          errors: {
            common: {
              msg: "You are not authorized to send messages in this conversation!",
            },
          },
        });
      }

      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid.toString(),
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
};
