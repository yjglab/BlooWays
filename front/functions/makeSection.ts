import { Talk, Private } from '@typings/types';
import dayjs from 'dayjs';

export default function makeSection<T extends Private | Talk>(talkList: T[]) {
  const sections: { [key: string]: T[] } = {};
  talkList.forEach((talk) => {
    const monthDate = dayjs(talk.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(talk);
    } else {
      sections[monthDate] = [talk];
    }
  });
  return sections;
}
