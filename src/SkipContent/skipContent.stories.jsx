import { PSASkipContent } from './skipContent';

const meta = {
  title: 'Inputs/SkipContent',
  component: PSASkipContent,
  tags: ['autodocs'],
};

export default meta;

export const DefaultSkipContent = () => {
  return (
    <>
      <PSASkipContent href="#main-content" text="Skip to main content" />
      <div id="main-content">
        Use Tab to navigate through the content
        <br />
        <a href="">This is a link</a>
      </div>
    </>
  );
};
