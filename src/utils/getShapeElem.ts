const getShapeElem = (id: string) => {
  return document.querySelector<SVGGeometryElement>(`[id=${id}]`);
};

export { getShapeElem };
