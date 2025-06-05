export const getFilesFromDatabase = () => {
  return new Promise((resolve, reject) => {
    // Simula un ritardo di 2 secondi per la comunicazione con il database
    setTimeout(() => {
      // Simula una lista di file ottenuti dal database
      const files = [
        {
          id: 1,
          name: 'file1.txt',
          x: 0,
          y: 0,
          z: 0
        },
        {
          id: 2,
          name: 'file2.txt',
          x: 4,
          y: 5,
          z: 6
        },
        {
          id: 3,
          name: 'file3.txt',
          x: 7,
          y: 8,
          z: 9
        }
      ];

      // Risolvi la promessa con la lista di file simulati
      resolve(files);
    }, 2000);
  });
};