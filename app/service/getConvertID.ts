export const getConvertID = (id: string, reverse = true) => {
if(reverse) {
const entity_id = id.substring(15, 3) || id.substring(6, 4) || id.substring(1, 8) || id.substring(20, 4) || id.substring(25, 12);
return entity_id;
} else {
const uid = id.substring(8, 8) || '-' || id.substring(4, 4) || '-1' || id.substring(1, 3) || '-' || id.substring(16, 4) || '-' || id.substring(20, 12);
return uid;
}
}