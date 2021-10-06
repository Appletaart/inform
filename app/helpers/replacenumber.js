import { helper } from '@ember/component/helper';

export default helper(function replacenumber(params/*, hash*/) {
  const [number] = params;
  const deletenumber = number.replace(/[0-9][0-9]./, '');
  return deletenumber;
});
