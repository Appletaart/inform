import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
export default class MainComponent extends Component {
    @service map; // yes
    @service searchBar;

    @action
    clear(){     
      this.map.empty;
      console.log(" work? ");
    }

}
