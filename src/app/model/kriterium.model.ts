// src/app/models/kriterium.model.ts
export interface Diskripsi {
  idSoalanDis: number;
  diskripsi: string;
}

export interface Soalan {
  markahMaksimum: number;
  idSoalan: number;
  tajuk: string;
  diskripsis: Diskripsi[];
  markahPpp?: number; // ⭐ PPP mark
  markahPpk?: number; // ⭐ PPK mark
}

export interface Kriterium {
  idKriteria: number;
  tajuk: string;
  instant: string;
  soalans: Soalan[];
}

export interface MarkahSoalanDto {
  idSoalan: number;
  markah: number;
}

export interface SaveMarkahRequest {
  idPenilaian: number;
  markahSoalans: MarkahSoalanDto[];
  jumlahMarkah: number;

  idSkt?: number;
  markahKeseluruhanPpsm?: number;
  idPegawai?: number;
}
