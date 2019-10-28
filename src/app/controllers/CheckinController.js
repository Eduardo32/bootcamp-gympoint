import { subDays } from 'date-fns';

import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.studentId);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const count = await Checkin.countDocuments().where({
      student_id: req.params.studentId,
      createdAt: { $gte: subDays(new Date(), 7), $lte: new Date() },
    });

    if (count > 4) {
      return res
        .status(401)
        .json({ error: 'You can only do 5 checkins in 7 days' });
    }

    const checkin = await Checkin.create({
      student_id: req.params.studentId,
    });
    return res.json(checkin);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const student = await Student.findByPk(req.params.studentId);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.find()
      .where({
        student_id: req.params.studentId,
      })
      .skip((page - 1) * 20)
      .limit(20);

    return res.json(checkins);
  }
}

export default new CheckinController();
