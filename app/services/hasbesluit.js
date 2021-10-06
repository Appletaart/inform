import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class HasbesluitService extends Service {
    @tracked bestuurseenheid = []

    addItem = (item) => {
      // console.log(item);
     return this.bestuurseenheid = item      
   }
}
