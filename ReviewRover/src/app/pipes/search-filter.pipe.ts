import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(searchList: any, searchValue: unknown): any {
    if (!searchList) return null;
    if (!searchValue) return searchList;

    const arg = searchValue.toString().toLowerCase();

    return searchList.filter(function (item: any) {
      const itemValues = Object.values(item);

      return itemValues?.some((val) => {
        return (val?.toString()?.toLowerCase().search(arg) ?? -1) !== -1;
      });
    });
  }
}
