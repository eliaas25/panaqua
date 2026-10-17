import { useNavigate, useLocation } from 'react-router-dom';

export function useScrollToSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (sectionId) => {
    const scroll = () => {
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    if (pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 80);
    } else {
      scroll();
    }
  };
}
