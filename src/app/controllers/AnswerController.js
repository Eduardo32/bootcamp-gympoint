import * as Yup from 'yup';

import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import AnswerMail from '../jobs/AnswerMail';

import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.helpOrderId, {
      include: {
        model: Student,
        as: 'student',
        attributes: ['name', 'email'],
      },
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found' });
    }

    if (helpOrder.answer) {
      return res.status(400).json({ error: 'Help order already answered' });
    }

    const {
      id,
      student_id,
      question,
      answer,
      answer_at,
    } = await helpOrder.update(req.body);

    await Queue.add(AnswerMail.key, { helpOrder });

    return res.json({ id, student_id, question, answer, answer_at });
  }
}

export default new AnswerController();
