export interface UlasanPenilaian {
  idUlasanPenilaian: number;
  idPenilaian: number;
  tempohPengawasanBulan: number | null;
  ulasanPrestasi: string | null;
  ulasanKerjaya: string | null;
  sahMaklumPrestasi: boolean;
  sahMaklumMarkah: boolean;
  tarikhHantar: Date | null;
  createdAt: Date | null;
  updateAt: Date | null;
}

export interface UlasanCombinedView {
  ulasanPpp?: {
    namaPenilai: string;
    tempohPengawasanBulan: number;
    ulasanPrestasi: string;
    ulasanKerjaya: string;
    sahMaklumPrestasi: boolean;
    sahMaklumMarkah: boolean;
    tarikhHantar?: Date;
  };
  ulasanPpk?: {
    namaPenilai: string;
    tempohPengawasanBulan: number;
    ulasanPrestasi: string;
    ulasanKerjaya: string;
    sahMaklumPrestasi: boolean;
    sahMaklumMarkah: boolean;
    tarikhHantar?: Date;
  };
}

export interface SaveUlasanRequest {
  idPenilaian: number;
  tempohPengawasanBulan: number;
  ulasanPrestasi: string;
  ulasanKerjaya: string;
  sahMaklumPrestasi: boolean;
  sahMaklumMarkah: boolean;
  // isPpp?: boolean;
  // isPpk?: boolean;
}

export interface SahkanPenilaianRequest {
  idSkt: number;
}
