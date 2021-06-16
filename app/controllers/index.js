import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @service map;
  @service searchBar;
  @tracked gemeente;

  @tracked toggleClick = false;

  @action toggleClose() {
    this.toggleClick = false;
    console.log("work? index controller");
  }

  @action clickToOpen() {
    this.searchBar.gemeente
    console.log(this.searchBar.gemeente);
    this.toggleClick = true;
  }
  
}
