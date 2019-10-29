import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.studentId);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { id, student_id, question } = await HelpOrder.create({
      student_id: student.id,
      question: req.body.question,
    });

    return res.json({ id, student_id, question });
  }

  async index(req, res) {
    const { page } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.studentId },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
