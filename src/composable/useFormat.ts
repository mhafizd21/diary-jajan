import dayjs from 'dayjs';

export default () => {
  const rupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  }
  const dateFormat = (date: Date | string, format?: string ) => {
    return dayjs(date)?.format(format || 'DD MMMM');
  }

  return {
    rupiah,
    dateFormat,
  }
}