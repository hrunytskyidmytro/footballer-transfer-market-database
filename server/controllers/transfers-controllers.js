const HttpError = require("../models/http-error");
const Transfer = require("../models/transfer");

const getTransfers = async (req, res, next) => {
  let transfers;
  try {
    transfers = await Transfer.find({});
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

const getTransferById = async (req, res, next) => {
  const transferId = req.params.tid;

  let transfer;
  try {
    transfer = await Transfer.findById(transferId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a transfer.",
      500
    );
    return next(error);
  }

  if (!transfer) {
    const error = new HttpError(
      "Could not find a transfer for the provided id.",
      404
    );
    return next(error);
  }

  res.send({ transfer: transfer.toObject({ getters: true }) });
};

const getTransfersByFootballer = async (req, res, next) => {
  const footballerId = req.params.fid;

  let transfers;
  try {
    transfers = await Transfer.find({ footballer: footballerId })
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

  if (!transfers || transfers.length === 0) {
    const error = new HttpError(
      "Could not find transfers for the provided footballer id.",
      404
    );
    return next(error);
  }

  res.json({
    transfers: transfers.map((transfer) =>
      transfer.toObject({ getters: true })
    ),
  });
};

exports.getTransfers = getTransfers;
exports.getTransferById = getTransferById;
exports.getTransfersByFootballer = getTransfersByFootballer;
