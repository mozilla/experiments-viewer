import store from '../store';
import * as urlActions from '../actions/url-actions';


export function addMissingQueryParameters(currentQueryParameters) {
  store.dispatch(urlActions.addMissingQueryParameters(currentQueryParameters));
}

export function updateQueryParameter(key, newValue) {
  store.dispatch(urlActions.updateQueryParameter(key, newValue));
}
