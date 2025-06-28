import { JSX } from 'react';
import FullScreen from './full-screen';

export default function SupportLayout(): JSX.Element {
  return (
    <div className="flex gap-2 items-center justify-center">
      <FullScreen />
    </div>
  );
}
