import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weigh: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExits = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExits) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      weigh: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    let student = await Student.findByPk(parseInt(req.params.id, 10));

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const { email } = req.body;

    if (email !== student.email) {
      const studentExits = await Student.findOne({
        where: { email },
      });

      if (studentExits) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }

    student = await student.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
