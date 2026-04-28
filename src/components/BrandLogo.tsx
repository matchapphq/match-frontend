import logoPurple from '../assets/full_logo_purple.svg';
import logoYellow from '../assets/full_logo_yellow.svg';
import { useTheme } from '../features/theme/context/ThemeContext';

type BrandLogoProps = {
  alt?: string;
  className?: string;
};

export function BrandLogo({ alt = 'Match', className = '' }: BrandLogoProps) {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? logoYellow : logoPurple;

  return <img src={logoSrc} alt={alt} className={className} />;
}
