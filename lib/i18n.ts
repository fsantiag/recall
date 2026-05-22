export type Language = 'en' | 'pt-BR'

export const LANGUAGE_KEY = 'recall_language'
export const DEFAULT_LANGUAGE: Language = 'pt-BR'

export interface Translations {
  navHome: string; navAdd: string; navSettings: string; navAriaLabel: string
  navToday: string; navAll: string; navCalendar: string
  allProceduresTitle: string
  alertTitle: string; alertSingular: string; alertPlural: string
  loading: string; empty: string; loadError: string
  markPaid: string; markPending: string; statusPaid: string; statusPending: string
  toastMarkedPaid: string; toastMarkedPending: string
  toastProcedureSaved: string; toastProcedureUpdated: string; toastProcedureDeleted: string
  fieldProcedureName: string; fieldPatientName: string; fieldPayer: string
  fieldLocation: string; fieldHonoraryType: string
  fieldDateTime: string; fieldReminderDays: string; saving: string; save: string
  saveFailed: string; procedureNameRequired: string; patientNameRequired: string
  payerRequired: string; dateRequired: string; reminderMinDays: string
  placeholderProcedureName: string; placeholderPatientName: string; placeholderPayer: string
  placeholderLocation: string; placeholderHonoraryType: string
  locationRequired: string; honoraryTypeRequired: string
  addProcedureTitle: string; editProcedureTitle: string; deleteProcedure: string
  deleteConfirm: string; deleteFailed: string; settingsTitle: string
  languageLabel: string; languageEn: string; languagePtBR: string
  // Today sections
  sectionOverdue: string; sectionToday: string; sectionThisWeek: string
  sectionUpcoming: string; sectionEmpty: string
  overdueLabel: string; dueTodayLabel: string; thisWeekLabel: string
  // Day chip picker
  remindInLabel: string; reminderDateLabel: string; daysLabel: string; reminderOn: string
  // Theme
  themeLabel: string; themeSystem: string; themeLight: string; themeDark: string
  // Notifications
  notificationsLabel: string; notificationsEnable: string; notificationsGranted: string
  // Onboarding
  onboardingHeadline: string; onboardingSubtitle: string
  onboardingF1Title: string; onboardingF1Body: string
  onboardingF2Title: string; onboardingF2Body: string
  onboardingF3Title: string; onboardingF3Body: string
  onboardingCta: string
  // Calendar
  calendarTitle: string; calendarNoItems: string
  // Form steps
  stepPatient: string; stepDetails: string; stepReview: string
  reviewTitle: string; addAnother: string
  // Install
  installBannerTitle: string; installBannerBody: string
  installButton: string; installDismiss: string; installShowAgain: string
  installSettingsTitle: string; installSettingsIosHint: string
  // Reminder picker
  customLabel: string
}

const en: Translations = {
  // Nav
  navHome: 'Home',
  navAdd: 'Add',
  navSettings: 'Settings',
  navAriaLabel: 'Main navigation',
  navToday: 'Today',
  navAll: 'All',
  navCalendar: 'Calendar',
  allProceduresTitle: 'All procedures',
  // Alert
  alertTitle: 'Payment Reminder',
  alertSingular: '1 procedure is past its claim deadline.',
  alertPlural: '{count} procedures are past their claim deadline.',
  // List
  loading: 'Loading...',
  empty: 'No procedures yet. Press + to add one.',
  loadError: 'Could not load procedures.',
  // Card
  markPaid: 'Mark as paid',
  markPending: 'Mark as pending',
  statusPaid: 'Paid',
  statusPending: 'Pending',
  toastMarkedPaid: 'Marked as paid',
  toastMarkedPending: 'Marked as pending',
  toastProcedureSaved: 'Procedure saved',
  toastProcedureUpdated: 'Procedure updated',
  toastProcedureDeleted: 'Procedure deleted',
  // Form
  fieldProcedureName: 'Procedure Name',
  fieldPatientName: 'Patient Name',
  fieldPayer: 'Payer',
  fieldDateTime: 'Date & Time',
  fieldReminderDays: 'Reminder Days',
  saving: 'Saving...',
  save: 'Save',
  saveFailed: 'Failed to save. Please try again.',
  procedureNameRequired: 'Procedure name is required',
  patientNameRequired: 'Patient name is required',
  payerRequired: 'Payer is required',
  dateRequired: 'Date is required',
  reminderMinDays: 'Must be at least 1 day',
  placeholderProcedureName: 'e.g. Consultation',
  placeholderPatientName: 'e.g. John Doe',
  placeholderPayer: 'e.g. Insurance',
  fieldLocation: 'Location',
  fieldHonoraryType: 'Fee Type',
  placeholderLocation: 'e.g. Hospital São Lucas',
  placeholderHonoraryType: 'e.g. Surgeon',
  locationRequired: 'Location is required',
  honoraryTypeRequired: 'Fee type is required',
  // Pages
  addProcedureTitle: 'Add Procedure',
  editProcedureTitle: 'Edit Procedure',
  deleteProcedure: 'Delete Procedure',
  deleteConfirm: 'Delete this procedure?',
  deleteFailed: 'Failed to delete. Please try again.',
  // Settings
  settingsTitle: 'Settings',
  languageLabel: 'Language',
  languageEn: 'English',
  languagePtBR: 'Português (Brasil)',
  sectionOverdue: 'Overdue', sectionToday: 'Today', sectionThisWeek: 'This week',
  sectionUpcoming: 'Upcoming', sectionEmpty: 'No billing reminders due.',
  overdueLabel: 'Overdue', dueTodayLabel: 'Due today', thisWeekLabel: 'This week',
  remindInLabel: 'Due in', reminderDateLabel: 'Due date', daysLabel: 'days', reminderOn: 'Due',
  themeLabel: 'Appearance', themeSystem: 'System', themeLight: 'Light', themeDark: 'Dark',
  notificationsLabel: 'Push notifications', notificationsEnable: 'Enable',
  notificationsGranted: 'Enabled',
  onboardingHeadline: 'Never lose track of a follow-up.',
  onboardingSubtitle: 'Log a procedure, set a reminder window, and get alerted when payment is due.',
  onboardingF1Title: 'Add a procedure', onboardingF1Body: 'Record the patient, payer, and date.',
  onboardingF2Title: 'Set a reminder window', onboardingF2Body: '3, 7, 30 days — whatever the payer requires.',
  onboardingF3Title: 'Get alerted on time', onboardingF3Body: 'Grouped by urgency. Works offline.',
  onboardingCta: 'Get started',
  calendarTitle: 'Calendar', calendarNoItems: 'No reminders this month.',
  stepPatient: 'Patient', stepDetails: 'Details', stepReview: 'Review',
  reviewTitle: 'Review', addAnother: 'Add another',
  installBannerTitle: 'Install Recall',
  installBannerBody: "Tap Share then 'Add to Home Screen'",
  installButton: 'Install',
  installDismiss: 'Dismiss install banner',
  installShowAgain: 'Show install banner again',
  installSettingsTitle: 'Install App',
  installSettingsIosHint: "To install, tap Share in Safari then 'Add to Home Screen'.",
  customLabel: 'Custom',
}

const ptBR: Translations = {
  // Nav
  navHome: 'Início',
  navAdd: 'Adicionar',
  navSettings: 'Configurações',
  navAriaLabel: 'Navegação principal',
  navToday: 'Hoje',
  navAll: 'Todos',
  navCalendar: 'Calendário',
  allProceduresTitle: 'Todos os procedimentos',
  // Alert
  alertTitle: 'Lembrete de Cobrança',
  alertSingular: '1 procedimento está com a cobrança em atraso.',
  alertPlural: '{count} procedimentos estão com a cobrança em atraso.',
  // List
  loading: 'Carregando...',
  empty: 'Nenhum procedimento ainda. Pressione + para adicionar.',
  loadError: 'Não foi possível carregar os procedimentos.',
  // Card
  markPaid: 'Marcar como pago',
  markPending: 'Marcar como pendente',
  statusPaid: 'Pago',
  statusPending: 'Pendente',
  toastMarkedPaid: 'Marcado como pago',
  toastMarkedPending: 'Marcado como pendente',
  toastProcedureSaved: 'Procedimento salvo',
  toastProcedureUpdated: 'Procedimento atualizado',
  toastProcedureDeleted: 'Procedimento excluído',
  // Form
  fieldProcedureName: 'Nome do Procedimento',
  fieldPatientName: 'Nome do Paciente',
  fieldPayer: 'Convênio / Pagador',
  fieldDateTime: 'Data e Hora',
  fieldReminderDays: 'Dias para Lembrete',
  saving: 'Salvando...',
  save: 'Salvar',
  saveFailed: 'Falha ao salvar. Tente novamente.',
  procedureNameRequired: 'Nome do procedimento é obrigatório',
  patientNameRequired: 'Nome do paciente é obrigatório',
  payerRequired: 'Convênio/pagador é obrigatório',
  dateRequired: 'Data é obrigatória',
  reminderMinDays: 'Deve ser pelo menos 1 dia',
  placeholderProcedureName: 'ex.: Consulta',
  placeholderPatientName: 'ex.: João Silva',
  placeholderPayer: 'ex.: Unimed',
  fieldLocation: 'Local',
  fieldHonoraryType: 'Tipo de Honorário',
  placeholderLocation: 'ex.: Hospital São Lucas',
  placeholderHonoraryType: 'ex.: Cirurgião',
  locationRequired: 'Local é obrigatório',
  honoraryTypeRequired: 'Tipo de honorário é obrigatório',
  // Pages
  addProcedureTitle: 'Adicionar Procedimento',
  editProcedureTitle: 'Editar Procedimento',
  deleteProcedure: 'Excluir Procedimento',
  deleteConfirm: 'Excluir este procedimento?',
  deleteFailed: 'Falha ao excluir. Tente novamente.',
  // Settings
  settingsTitle: 'Configurações',
  languageLabel: 'Idioma',
  languageEn: 'English',
  languagePtBR: 'Português (Brasil)',
  sectionOverdue: 'Em atraso', sectionToday: 'Hoje', sectionThisWeek: 'Esta semana',
  sectionUpcoming: 'Próximos', sectionEmpty: 'Nenhum lembrete de cobrança pendente.',
  overdueLabel: 'Em atraso', dueTodayLabel: 'Vence hoje', thisWeekLabel: 'Esta semana',
  remindInLabel: 'Vence em', reminderDateLabel: 'Data de vencimento', daysLabel: 'dias', reminderOn: 'Vence',
  themeLabel: 'Aparência', themeSystem: 'Sistema', themeLight: 'Claro', themeDark: 'Escuro',
  notificationsLabel: 'Notificações push', notificationsEnable: 'Ativar',
  notificationsGranted: 'Ativado',
  onboardingHeadline: 'Nunca perca uma cobrança.',
  onboardingSubtitle: 'Registre o procedimento, defina o prazo e receba alertas quando o pagamento vencer.',
  onboardingF1Title: 'Adicione um procedimento', onboardingF1Body: 'Registre o paciente, convênio e data.',
  onboardingF2Title: 'Defina o prazo', onboardingF2Body: '3, 7, 30 dias — conforme o convênio exige.',
  onboardingF3Title: 'Receba alertas no prazo', onboardingF3Body: 'Agrupado por urgência. Funciona offline.',
  onboardingCta: 'Começar',
  calendarTitle: 'Calendário', calendarNoItems: 'Nenhum lembrete neste mês.',
  stepPatient: 'Paciente', stepDetails: 'Detalhes', stepReview: 'Revisão',
  reviewTitle: 'Revisão', addAnother: 'Adicionar outro',
  installBannerTitle: 'Instalar o Recall',
  installBannerBody: "Toque em Compartilhar e depois 'Adicionar à Tela de Início'",
  installButton: 'Instalar',
  installDismiss: 'Fechar aviso de instalação',
  installShowAgain: 'Mostrar aviso de instalação novamente',
  installSettingsTitle: 'Instalar aplicativo',
  installSettingsIosHint: "Para instalar, toque em Compartilhar no Safari e depois 'Adicionar à Tela de Início'.",
  customLabel: 'Personalizado',
}

export const translations: Record<Language, Translations> = { en, 'pt-BR': ptBR }

export type TranslationKey = keyof Translations
