const Transfer = require("../models/transfer");
const Footballer = require("../models/footballer");

const HttpError = require("../models/http-error");
const moment = require("moment");

const getTransfersStatistics = async (req, res, next) => {
  let totalTransferFee;
  let transferData;
  let totalFootballers;
  let totaTransfers;
  let transferCountsByMonth = {};
  let transferCountsArray;
  let transferCountByType = {};

  try {
    const transfers = await Transfer.find({});
    const footballers = await Footballer.find({});

    totalTransferFee = transfers.reduce(
      (sum, transfer) => sum + transfer.transferFee,
      0
    );

    totalFootballers = footballers.length;
    totaTransfers = transfers.length;

    transferData = transfers.map((transfer) => ({
      transferDate: moment(transfer.transferDate).format("YYYY-MM-DD"),
      transferFee: transfer.transferFee,
    }));

    transfers.forEach((transfer) => {
      const month = moment(transfer.transferDate).format("YYYY-MM");
      if (!transferCountsByMonth[month]) {
        transferCountsByMonth[month] = 0;
      }
      transferCountsByMonth[month]++;
    });

    transferCountsArray = Object.keys(transferCountsByMonth).map((month) => ({
      month,
      count: transferCountsByMonth[month],
    }));

    transfers.forEach((transfer) => {
      const type = transfer.transferType;
      if (!transferCountByType[type]) {
        transferCountByType[type] = 0;
      }
      transferCountByType[type]++;
    });

    transferCountByType = Object.keys(transferCountByType).map((type) => ({
      transferType: type,
      count: transferCountByType[type],
    }));
  } catch (err) {
    const error = new HttpError("Failed to fetch statistics.", 500);
    return next(error);
  }

  res.json({
    statistics: {
      totalTransferFee,
      totalFootballers,
      totaTransfers,
      transferData,
      transferCountsByMonth: transferCountsArray,
      transferCountByType,
    },
  });
};

exports.getTransfersStatistics = getTransfersStatistics;
