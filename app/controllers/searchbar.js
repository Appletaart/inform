import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SearchbarController extends Controller {
  @tracked toggleClick = true;

  @action toggleClose() {
    this.toggleClick = false;
    console.log("work? controller search");
  }

  @action clickToOpen() {
    this.toggleClick = true;
  }
}
