export function downloadFile<O>(data: O, name: string): void {
  const element = document.createElement('a');

  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)),
  );

  element.setAttribute('download', `${name}.json`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
