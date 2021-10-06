import { helper } from '@ember/component/helper';

export default helper(function replacespace(params/*, hash*/) {
  const [space] = params;
  const fixspace = space.replace(/^\s+|\s+$/g, '');
  // console.log(fixspace, fixspace.length );
  return fixspace;
});
