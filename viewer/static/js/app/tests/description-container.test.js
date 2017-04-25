import React from 'react';
import { render } from 'enzyme';

import DescriptionContainer from '../components/containers/description-container';

describe('DescriptionContainer', () => {
  it('All tags should be stripped from description before display', () => {
    const description = '<script src="http://example.com/example.js"></script>word1 <b>word2</b> <blockquote>word3</blockquote><br>';
    const dc = render(<DescriptionContainer rawDescription={description} />);
    const descriptionElm = dc.find('.description');
    expect(descriptionElm.text()).toBe('word1 word2 word3');
  });

  it('Line breaks should be converted to <br> elements in description', () => {
    const description = 'Mozilla\nbuilds\n\nthe\rFirefox\nbrowser';
    const dc = render(<DescriptionContainer rawDescription={description} />);
    const descriptionElm = dc.find('.description');
    expect(descriptionElm.html()).toBe('Mozilla<br>\nbuilds<br>\n<br>\nthe<br>\rFirefox<br>\nbrowser');
  });
});
