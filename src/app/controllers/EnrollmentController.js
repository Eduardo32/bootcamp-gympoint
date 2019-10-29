import * as Yup from 'yup';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

import EnrollmentMail from '../jobs/EnrollmentMail';

import Queue from '../../lib/Queue';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date()
        .min(new Date())
        .required(),
      canceled_at: Yup.date().min(new Date()),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    // Verificar depois se o student ja tem uma matricula naquele periodo

    const plan = await Plan.findByPk(req.body.plan_id, {
      where: { active: true },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await Enrollment.create(req.body);

    await Queue.add(EnrollmentMail.key, {
      student,
      plan,
      start_date,
      end_date,
      price,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive(),
      plan_id: Yup.number()
        .integer()
        .positive(),
      start_date: Yup.date().min(new Date()),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (req.body.student_id) {
      const student = await Student.findByPk(req.body.student_id);

      if (!student) {
        return res.status(400).json({ error: 'Student not found' });
      }
    }

    if (req.body.plan_id) {
      const plan = await Plan.findByPk(req.body.plan_id);

      if (!plan || !plan.active) {
        return res.status(400).json({ error: 'Plan not found' });
      }
    }

    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await enrollment.update(req.body);

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    const {
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
      canceled_at,
    } = await enrollment.update({ canceled_at: new Date() });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
      canceled_at,
    });
  }
}

export default new EnrollmentController();
