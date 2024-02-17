const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Footballer = require("../models/footballer");
const Transfer = require("../models/transfer");
const Club = require("../models/club");
const User = require("../models/user");
const Agent = require("../models/agent");
const New = require("../models/new");

//Footballers

const getFootballers = async (req, res, next) => {
  let footballers;
  try {
    footballers = await Footballer.find({}).populate("agent").populate("club");
  } catch (err) {
    const error = new HttpError(
      "Fetching footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    footballers: footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

const getFootballerById = async (req, res, next) => {
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find a footballer.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    return next(new HttpError("Could not find footballer.", 404));
  }

  console.log(footballer);

  res.json({
    footballer: footballer.toObject({ getters: true }),
  });
};

const getFootballersByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithFootballers;
  try {
    userWithFootballers = await User.findById(userId).populate("footballers");
  } catch (err) {
    const error = new HttpError(
      "Fetching footballers failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithFootballers || userWithFootballers.footballers.length === 0) {
    return next(
      new HttpError("Could not find footballers for the provided user id.", 404)
    );
  }

  console.log(userWithFootballers);

  res.json({
    footballers: userWithFootballers.footballers.map((footballer) =>
      footballer.toObject({ getters: true })
    ),
  });
};

const createFootballer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    surname,
    nationality,
    birthDate,
    weight,
    height,
    age,
    foot,
    club,
    contractUntil,
    placeOfBirth,
    mainPosition,
    additionalPosition,
    cost,
    agent,
  } = req.body;

  let existingFootballer;
  try {
    existingFootballer = await Footballer.findOne({
      $or: [{ name }, { surname }],
    });
  } catch (err) {
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (existingFootballer) {
    const error = new HttpError(
      "Footballer with the same name or surname already exists.",
      422
    );
    return next(error);
  }

  const createdFootballer = new Footballer({
    name,
    surname,
    nationality,
    birthDate,
    weight,
    height,
    age,
    foot,
    club,
    contractUntil,
    placeOfBirth,
    mainPosition,
    additionalPosition,
    cost,
    agent,
    image: req.file.path,
    creator: req.userData.userId,
    clubs: [],
    transfers: [],
  });

  console.log(req.userData);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFootballer.save({ session: sess });
    user.footballers.push(createdFootballer);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ footballer: createdFootballer });
};

const updateFootballer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    name,
    surname,
    birthDate,
    nationality,
    weight,
    height,
    age,
    foot,
    contractUntil,
    placeOfBirth,
    mainPosition,
    additionalPosition,
    cost,
  } = req.body;
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update footballer.",
      500
    );
    return next(error);
  }

  footballer.name = name;
  footballer.surname = surname;
  footballer.birthDate = birthDate;
  footballer.nationality = nationality;
  footballer.weight = weight;
  footballer.height = height;
  footballer.age = age;
  footballer.foot = foot;
  footballer.contractUntil = contractUntil;
  footballer.placeOfBirth = placeOfBirth;
  footballer.mainPosition = mainPosition;
  footballer.additionalPosition = additionalPosition;
  footballer.cost = cost;

  try {
    await footballer.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update footballer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ footballer: footballer.toObject({ getters: true }) });
};

const deleteFootballer = async (req, res, next) => {
  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId).populate("creator");
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not delete footballer.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    const error = new HttpError("Could not find footballer for this id.", 404);
    return next(error);
  }

  const imagePath = footballer.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await footballer.deleteOne({ session: sess });
    footballer.creator.footballers.pull(footballer);
    await footballer.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete footballer.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted footballer." });
};

//Transfers

const getTransfers = async (req, res, next) => {
  let transfers;
  try {
    transfers = await Transfer.find({})
      .populate("footballer")
      .populate("fromClub")
      .populate("toClub");
  } catch (err) {
    const error = new HttpError(
      "Fetching transfers failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    transfers: transfers.map((transfer) =>
      transfer.toObject({ getters: true })
    ),
  });
};

const createTransfer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    footballer,
    fromClub,
    toClub,
    transferFee,
    transferType,
    season,
    compensationAmount,
  } = req.body;

  if (fromClub === toClub) {
    const error = new HttpError(
      "Source and destination clubs cannot be the same.",
      422
    );
    return next(error);
  }

  let footballerForTransfer;
  try {
    footballerForTransfer = await Footballer.findById(footballer);
  } catch (err) {
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (!footballerForTransfer) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  const createdTransfer = new Transfer({
    footballer,
    fromClub,
    toClub,
    transferFee,
    transferType,
    season,
    compensationAmount,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTransfer.save({ session: sess });
    footballerForTransfer.transfers.push(createdTransfer);
    await footballerForTransfer.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Creating transfer failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ transfer: createdTransfer });
};

const getTransferById = async (req, res, next) => {
  const transferId = req.params.tid;

  let transfer;
  try {
    transfer = await Transfer.findById(transferId);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong, could not find a transfer.",
      500
    );
    return next(error);
  }

  if (!transfer) {
    return next(new HttpError("Could not find transfer.", 404));
  }

  res.json({
    transfer: transfer.toObject({ getters: true }),
  });
};

const updateTransfer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    transferFee,
    transferDate,
    transferType,
    season,
    compensationAmount,
  } = req.body;
  const transferId = req.params.tid;

  let transfer;
  try {
    transfer = await Transfer.findById(transferId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update transfer.",
      500
    );
    return next(error);
  }

  transfer.transferFee = transferFee;
  transfer.transferDate = transferDate;
  transfer.transferType = transferType;
  transfer.season = season;
  transfer.compensationAmount = compensationAmount;

  try {
    await transfer.save();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not update transfer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ transfer: transfer.toObject({ getters: true }) });
};

const deleteTransfer = async (req, res, next) => {
  const transferId = req.params.tid;

  let transfer;
  try {
    transfer = await Transfer.findById(transferId).populate("footballer");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete transfer.",
      500
    );
    return next(error);
  }

  if (!transfer) {
    const error = new HttpError("Could not find transfer for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await transfer.deleteOne({ session: sess });
    transfer.footballer.transfers.pull(transfer);
    await transfer.footballer.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete transfer.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted transfer." });
};

//Clubs

const getClubs = async (req, res, next) => {
  let clubs;
  try {
    clubs = await Club.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching clubs failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    clubs: clubs.map((club) => club.toObject({ getters: true })),
  });
};

const getClubById = async (req, res, next) => {
  const clubId = req.params.cid;

  let club;
  try {
    club = await Club.findById(clubId);
  } catch (err) {
    const error = new HttpError(
      "Fetching club failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!club) {
    return next(
      new HttpError("Could not find club for the provided user id.", 404)
    );
  }

  console.log(club);

  res.json({
    club: club.toObject({ getters: true }),
  });
};

const createClub = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, country, description, cost, foundationYear } = req.body;

  const createdClub = new Club({
    name,
    country,
    image:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    description,
    cost,
    foundationYear,
  });

  const footballerId = req.params.fid;

  let footballer;
  try {
    footballer = await Footballer.findById(footballerId);
  } catch (err) {
    const error = new HttpError(
      "Creating footballer failed, please try again.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    const error = new HttpError(
      "Could not find footballer for provided id.",
      404
    );
    return next(error);
  }

  console.log(footballer);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdClub.save({ session: sess });
    footballer.clubs.push(createdClub);
    await footballer.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError("Creating club failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ club: createdClub });
};

const updateClub = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, country, description, cost, foundationYear } = req.body;
  const clubId = req.params.cid;

  let club;
  try {
    club = await Club.findById(clubId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update club.",
      500
    );
    return next(error);
  }

  club.name = name;
  club.country = country;
  club.description = description;
  club.cost = cost;
  club.foundationYear = foundationYear;

  try {
    await club.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update club.",
      500
    );
    return next(error);
  }

  res.status(200).json({ club: club.toObject({ getters: true }) });
};

const deleteClub = async (req, res, next) => {
  const clubId = req.params.cid;

  let club;
  try {
    club = await Club.findById(clubId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete club.",
      500
    );
    return next(error);
  }

  if (!club) {
    const error = new HttpError("Could not find club for this id.", 404);
    return next(error);
  }

  console.log(club);

  let footballer;
  try {
    footballer = await Footballer.findOne({ clubs: clubId }).populate("clubs");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete footballer.",
      500
    );
    return next(error);
  }

  if (!footballer) {
    const error = new HttpError("Could not find footballer for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await club.deleteOne({ session: sess });
    footballer.clubs.pull(club);
    await footballer.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete club.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted club." });
};

//Agents

const getAgents = async (req, res, next) => {
  let agents;
  try {
    agents = await Agent.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching agents failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    agents: agents.map((agent) => agent.toObject({ getters: true })),
  });
};

const getAgentById = async (req, res, next) => {
  const agentId = req.params.aid;

  let agent;
  try {
    agent = await Agent.findById(agentId);
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not find a agent.",
      500
    );
    return next(error);
  }

  if (!agent) {
    const error = new HttpError(
      "Could not find a agent for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ agent: agent.toObject({ getters: true }) });
};

const createAgent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, country, email, phoneNumber, description } = req.body;

  let existingAgent;
  try {
    existingAgent = await Agent.findOne({
      $or: [{ name }, { surname }],
    });
  } catch (err) {
    const error = new HttpError(
      "Creating agent failed, please try again.",
      500
    );
    return next(error);
  }

  if (existingAgent) {
    const error = new HttpError(
      "Agent with the same name or surname already exists.",
      422
    );
    return next(error);
  }

  const createdAgent = new Agent({
    name,
    surname,
    country,
    email,
    phoneNumber,
    image: req.file.path,
    description,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdAgent.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Creating agent failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ agent: createdAgent });
};

const updateAgent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, country, email, phoneNumber, description } = req.body;
  const agentId = req.params.aid;

  let agent;
  try {
    agent = await Agent.findById(agentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update agent.",
      500
    );
    return next(error);
  }

  agent.name = name;
  agent.surname = surname;
  agent.country = country;
  agent.email = email;
  agent.phoneNumber = phoneNumber;
  agent.description = description;

  try {
    await agent.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update agent.",
      500
    );
    return next(error);
  }

  res.status(200).json({ agent: agent.toObject({ getters: true }) });
};

const deleteAgent = async (req, res, next) => {
  const agentId = req.params.aid;

  let agent;
  try {
    agent = await Agent.findById(agentId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete agent.",
      500
    );
    return next(error);
  }

  if (!agent) {
    const error = new HttpError("Could not find agent for this id.", 404);
    return next(error);
  }

  const imagePath = agent.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await agent.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete agent.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted agent." });
};

//News

const getNews = async (req, res, next) => {
  let news;
  try {
    news = await New.find({}).populate("author");
  } catch (err) {
    const error = new HttpError(
      "Fetching news failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    news: news.map((n) => n.toObject({ getters: true })),
  });
};

const getNewById = async (req, res, next) => {
  const newId = req.params.nid;

  let n;
  try {
    n = await New.findById(newId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a new.",
      500
    );
    return next(error);
  }

  if (!n) {
    const error = new HttpError(
      "Could not find a new for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ n: n.toObject({ getters: true }) });
};

const createNew = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;

  const createdNew = new New({
    title,
    description,
    image: req.file.path,
    author: req.userData.userId,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdNew.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating new failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ new: createdNew });
};

const updateNew = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const newId = req.params.nid;

  let n;
  try {
    n = await New.findById(newId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update new.",
      500
    );
    return next(error);
  }

  n.title = title;
  n.description = description;

  try {
    await n.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update new.",
      500
    );
    return next(error);
  }

  res.status(200).json({ n: n.toObject({ getters: true }) });
};

const deleteNew = async (req, res, next) => {
  const newId = req.params.nid;

  let n;
  try {
    n = await New.findById(newId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete new.",
      500
    );
    return next(error);
  }

  if (!n) {
    const error = new HttpError("Could not find new for this id.", 404);
    return next(error);
  }

  const imagePath = n.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await n.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete new.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted new." });
};

//Users

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ user: user.toObject({ getters: true }) });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, surname, email } = req.body;
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  user.name = name;
  user.surname = surname;
  user.email = email;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Something went wrong, could not delete user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted user." });
};

exports.getFootballers = getFootballers;
exports.getFootballerById = getFootballerById;
exports.getFootballersByUserId = getFootballersByUserId;
exports.createFootballer = createFootballer;
exports.updateFootballer = updateFootballer;
exports.deleteFootballer = deleteFootballer;
exports.getTransfers = getTransfers;
exports.getTransferById = getTransferById;
exports.createTransfer = createTransfer;
exports.updateTransfer = updateTransfer;
exports.deleteTransfer = deleteTransfer;
exports.getClubs = getClubs;
exports.getClubById = getClubById;
exports.createClub = createClub;
exports.updateClub = updateClub;
exports.deleteClub = deleteClub;
exports.getAgents = getAgents;
exports.getAgentById = getAgentById;
exports.createAgent = createAgent;
exports.updateAgent = updateAgent;
exports.deleteAgent = deleteAgent;
exports.getNews = getNews;
exports.getNewById = getNewById;
exports.createNew = createNew;
exports.updateNew = updateNew;
exports.deleteNew = deleteNew;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
