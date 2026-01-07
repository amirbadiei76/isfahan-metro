export interface Station {
    id: number;
    name: string;
    x: number;
    y: number;
    lat: number;
    lon: number;
    textX?: number;
    textY?: number;
    arrowX: number;
    arrowY: number;
    arrowRotation: number;
}
  

export const stations: Station[] = [
    { id: 1, name: 'قدس', x: -135, y: 263, lat: 32.7151141712866, lon: 51.60333611331703, textX: 5, textY: 24, arrowX: 23, arrowY: 2.5, arrowRotation: -84 },
    { id: 2, name: 'بهارستان', x: -90, y: 267, lat: 32.713170800237954, lon: 51.61664593709443, textX: 8, textY: 19, arrowX: 20, arrowY: -3, arrowRotation: -102 },
    { id: 3, name: 'گلستان', x: -45, y: 259, lat: 32.71552248341668, lon: 51.631215428150234, textX: 8, textY: 19, arrowX: 28, arrowY: -2, arrowRotation: -97 },
    { id: 4, name: 'شهید مفتح', x: 10, y: 254, lat: 32.715991294590495, lon: 51.64477609432377, textX: 14, textY: 19, arrowX: 35, arrowY: 3, arrowRotation: -84 },
    { id: 5, name: 'شهید علیخانی', x: 78, y: 260, lat: 32.714734857621295, lon: 51.659023111705565, textX: 2, textY: 23, arrowX: 13, arrowY: 21, arrowRotation: -35 },
    { id: 6, name: 'جابر', x: 104, y: 300, lat: 32.708886068099325, lon: 51.66593699401919, textX: -9, textY: 8, arrowX: 8, arrowY: 19, arrowRotation: -27 },
    { id: 7, name: 'کاوه', x: 122, y: 340, lat: 32.698770346197676, lon: 51.6744685624733, textX: -12, textY: 3, arrowX: -1, arrowY: 21, arrowRotation: 0 },
    { id: 8, name: 'شهید چمران', x: 120, y: 380, lat: 32.68749028926524, lon: 51.673603528527664, textX: -12, textY: 3, arrowX: -1, arrowY: 21.5, arrowRotation: 2 },
    { id: 9, name: 'شهید باهنر', x: 118, y: 420, lat: 32.679915486140274, lon: 51.672016765056846, textX: -12, textY: 3, arrowX: -1, arrowY: 21, arrowRotation: 0 },
    { id: 10, name: 'شهدا', x: 116, y: 460, lat: 32.671617434283455, lon: 51.67116291152457, textX: -12, textY: 3, arrowX: -1, arrowY: 17, arrowRotation: 0 },
    { id: 11, name: 'تختی', x: 114, y: 497, lat: 32.66410982972642, lon: 51.67018168080609, textX: -12, textY: 3, arrowX: -1, arrowY: 22, arrowRotation: 0 },
    { id: 12, name: 'امام حسین', x: 112, y: 540, lat: 32.65767973352342, lon: 51.669330237848115, textX: -12, textY: 3, arrowX: -1, arrowY: 21, arrowRotation: 0 },
    { id: 13, name: 'انقلاب', x: 110, y: 580, lat: 32.64871227815569, lon: 51.6680346640342, textX: -12, textY: -2, arrowX: -1, arrowY: 22, arrowRotation: 0 },
    // test { id: 13, name: 'انقلاب', x: 110, y: 580, lat: 32.64833311704253, lon: 51.67938956042762, textX: -12, textY: -2, arrowX: -1, arrowY: 22, arrowRotation: 0 },
    { id: 14, name: 'سی و سه پل', x: 108, y: 622, lat: 32.6389396893128, lon: 51.66650993895681, textX: -12, textY: 3, arrowX: -1, arrowY: 22, arrowRotation: 0 },
    { id: 15, name: 'دکتر شریعتی', x: 106, y: 665, lat: 32.628704851753646, lon: 51.66537540787613, textX: -12, textY: 3, arrowX: -1, arrowY: 18, arrowRotation: 0 },
    { id: 16, name: 'آزادی', x: 104, y: 700, lat: 32.622345810135386, lon: 51.66447140226871, textX: -12, textY: 3, arrowX: -1.5, arrowY: 18, arrowRotation: 0 },
    { id: 17, name: 'دانشگاه', x: 102, y: 735, lat: 32.615138931267246, lon: 51.663586878745924, textX: -12, textY: 3, arrowX: -1, arrowY: 23, arrowRotation: 0 },
    { id: 18, name: 'کارگر', x: 100, y: 780, lat: 32.605146961408224, lon: 51.664364938833366, textX: -12, textY: 3, arrowX: 13, arrowY: 18, arrowRotation: -40 },
    { id: 19, name: 'کوی امام', x: 130, y: 820, lat: 32.59819894058412, lon: 51.66832967567792, textX: -12, textY: 3, arrowX: 3, arrowY: 21, arrowRotation: -11 },
    { id: 20, name: 'صفه', x: 137, y: 860, lat: 32.58831291365663, lon: 51.669683351186684, textX: -12, textY: 3, arrowX: 0, arrowY: 0, arrowRotation: 0 },
];