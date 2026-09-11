import { enUS, ptBR } from 'date-fns/locale';
import { ShippedLocale } from './languages';

const DATE_FNS_LOCALES = {
  en: enUS,
  'pt-BR': ptBR,
};

export function getDateFnsLocale(locale: ShippedLocale) {
  return DATE_FNS_LOCALES[locale] ?? enUS;
}
