export interface JajanDetail {
  jam: string;
  tanggal: string;
  nama: string;
  pengeluaraan: number;
}

export interface GroupedJajanDetail {
  tanggal: string;
  data: JajanDetail[];
}