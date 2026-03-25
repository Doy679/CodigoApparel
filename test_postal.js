const usePostalPH = require('use-postal-ph').default || require('use-postal-ph');
const { fetchDataLists } = usePostalPH();
console.log(fetchDataLists({ municipality: 'Dalaguete' }));
console.log(fetchDataLists({ municipality: 'City of Manila' }));
