import { Pipe, PipeTransform } from "@angular/core";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

@Pipe({
  name: "title",
})
export class TitlePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return toTitleCase(value);
  }
}
