export type Petunjuk = {
  idPprestasi: number | null | undefined;
  jenisPetunjuk: string | null | undefined;
  keterangan: string | null | undefined;
  sasaranKerja: number | null | undefined;
  pencapaianSebenar: number | null | undefined;
  ulasan: string | null | undefined;
};

export type AktivitiGroup = {
  idAktiviti: number;
  aktiviti: string;
  petunjuk: Petunjuk[];
};
