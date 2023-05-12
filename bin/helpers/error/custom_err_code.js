const FORBIDDEN = [];

FORBIDDEN[4031] = (minutes) => {
  return {
    message: `the same request is limited..., wait for ${minutes} minutes`,
    code: 4031
  };
};

FORBIDDEN[4032] = (seconds) => {
  return {
    message: `Percobaan berulangkali gagal untuk masuk ke akun Anda, Anda dapat kembali login dalam waktu ${seconds} detik`,
    code: 4032
  };
};

FORBIDDEN[4033] = {
  message: 'Tidak dapat login, akun Anda sementara dinon-aktifkan',
  code: 4033
};

FORBIDDEN[4034] = {
  message: 'Akun tidak ditemukan. Salesman terkait telah resign',
  code: 4033
};

module.exports = {
  FORBIDDEN
};
