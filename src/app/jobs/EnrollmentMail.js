import { parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';

import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { student, plan, start_date, end_date, price } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matricula efetuada',
      template: 'enrollment',
      context: {
        student: student.name,
        plan_title: plan.title,
        plan_duration: `${plan.duration} ${
          plan.duration === 1 ? 'mês' : 'meses'
        }`,
        plan_price: plan.price,
        enrollment_start_date: format(
          parseISO(start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        enrollment_end_date: format(
          parseISO(end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        enrollment_price: price,
      },
    });
  }
}

export default new EnrollmentMail();
