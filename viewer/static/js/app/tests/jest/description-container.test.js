import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DescriptionContainer from '../../components/containers/description-container';


Enzyme.configure({ adapter: new Adapter() });

describe('DescriptionContainer', () => {
  it('All HTML should be stripped', () => {
    const description = '<script src="http://example.com/example.js"></script>word1 <b>word2</b> <blockquote>word3</blockquote>';
    const dc = Enzyme.mount(<DescriptionContainer rawDescription={description} />);
    const descriptionElm = dc.find('.description');
    expect(descriptionElm.html()).toContain('word1 word2 word3');
  });

  it('<br> tags should be converted to spaces', () => {
    const description = 'Distribution<br />Viewer<br>is<br />awesome!';
    const dc = Enzyme.mount(<DescriptionContainer rawDescription={description} />);
    const descriptionElm = dc.find('.description');
    expect(descriptionElm.html()).toContain('Distribution Viewer is awesome!');
  });

  it('When keepLinebreaks is set, <br> elements should be added alongside line breaks', () => {
    const description = 'Mozilla\nbuilds\n\nthe\rFirefox\nbrowser';
    const dc = Enzyme.mount(<DescriptionContainer rawDescription={description} keepLinebreaks={true} />);
    const descriptionElm = dc.find('.description');
    expect(descriptionElm.html()).toContain('Mozilla<br>\nbuilds<br>\n<br>\nthe<br>\nFirefox<br>\nbrowser');
  });
});
