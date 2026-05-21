export type Language = 'en' | 'pt-BR'

export const LANGUAGE_KEY = 'recall_language'
export const DEFAULT_LANGUAGE: Language = 'pt-BR'

export interface Translations {
  pinSetupTitle: string; pinLockTitle: string; pinLabel: string; pinConfirmLabel: string
  pinPlaceholder: string; pinConfirmPlaceholder: string; pinTooShort: string
  pinMismatch: string; pinIncorrect: string; pinSetButton: string; pinUnlockButton: string
  navHome: string; navAdd: string; navSettings: string; navAriaLabel: string
  alertTitle: string; alertSingular: string; alertPlural: string
  loading: string; empty: string; loadError: string
  markPaid: string; markPending: string; statusPaid: string; statusPending: string
  fieldProcedureName: string; fieldPatientName: string; fieldPayer: string
  fieldDateTime: string; fieldReminderDays: string; saving: string; save: string
  saveFailed: string; procedureNameRequired: string; patientNameRequired: string
  payerRequired: string; dateRequired: string; reminderMinDays: string
  placeholderProcedureName: string; placeholderPatientName: string; placeholderPayer: string
  addProcedureTitle: string; editProcedureTitle: string; deleteProcedure: string
  deleteConfirm: string; deleteFailed: string; settingsTitle: string
  changePinTitle: string; currentPin: string; newPin: string; confirmNewPin: string
  currentPinIncorrect: string; newPinTooShort: string; newPinMismatch: string
  pinChanged: string; changePinButton: string; changePinFailed: string
  languageLabel: string; languageEn: string; languagePtBR: string
  // Snooze
  snooze: string; statusSnoozed: string
  // Today sections
  sectionOverdue: string; sectionToday: string; sectionThisWeek: string
  sectionUpcoming: string; sectionEmpty: string
  overdueLabel: string; dueTodayLabel: string; thisWeekLabel: string
  // Day chip picker
  remindInLabel: string; reminderDateLabel: string; daysLabel: string
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
}

const en: Translations = {
  // PIN Gate
  pinSetupTitle: 'Set up your PIN',
  pinLockTitle: 'Enter your PIN',
  pinLabel: 'PIN',
  pinConfirmLabel: 'Confirm PIN',
  pinPlaceholder: 'Enter PIN',
  pinConfirmPlaceholder: 'Confirm PIN',
  pinTooShort: 'PIN must be at least 4 characters',
  pinMismatch: 'PINs do not match',
  pinIncorrect: 'Incorrect PIN',
  pinSetButton: 'Set PIN',
  pinUnlockButton: 'Unlock',
  // Nav
  navHome: 'Home',
  navAdd: 'Add',
  navSettings: 'Settings',
  navAriaLabel: 'Main navigation',
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
  // Pages
  addProcedureTitle: 'Add Procedure',
  editProcedureTitle: 'Edit Procedure',
  deleteProcedure: 'Delete Procedure',
  deleteConfirm: 'Delete this procedure?',
  deleteFailed: 'Failed to delete. Please try again.',
  // Settings
  settingsTitle: 'Settings',
  changePinTitle: 'Change PIN',
  currentPin: 'Current PIN',
  newPin: 'New PIN',
  confirmNewPin: 'Confirm New PIN',
  currentPinIncorrect: 'Current PIN is incorrect',
  newPinTooShort: 'New PIN must be at least 4 characters',
  newPinMismatch: 'New PINs do not match',
  pinChanged: 'PIN changed successfully.',
  changePinButton: 'Change PIN',
  changePinFailed: 'Failed to change PIN. Please try again.',
  languageLabel: 'Language',
  languageEn: 'English',
  languagePtBR: 'Português (Brasil)',
  snooze: 'Snooze 3 days', statusSnoozed: 'Snoozed',
  sectionOverdue: 'Overdue', sectionToday: 'Today', sectionThisWeek: 'This week',
  sectionUpcoming: 'Upcoming', sectionEmpty: 'No billing reminders due.',
  overdueLabel: 'Overdue', dueTodayLabel: 'Due today', thisWeekLabel: 'This week',
  remindInLabel: 'Remind me in', reminderDateLabel: 'Reminder date', daysLabel: 'days',
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
}

const ptBR: Translations = {
  // PIN Gate
  pinSetupTitle: 'Configure seu PIN',
  pinLockTitle: 'Digite seu PIN',
  pinLabel: 'PIN',
  pinConfirmLabel: 'Confirmar PIN',
  pinPlaceholder: 'Digite o PIN',
  pinConfirmPlaceholder: 'Confirmar PIN',
  pinTooShort: 'O PIN deve ter pelo menos 4 caracteres',
  pinMismatch: 'Os PINs não coincidem',
  pinIncorrect: 'PIN incorreto',
  pinSetButton: 'Definir PIN',
  pinUnlockButton: 'Desbloquear',
  // Nav
  navHome: 'Início',
  navAdd: 'Adicionar',
  navSettings: 'Configurações',
  navAriaLabel: 'Navegação principal',
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
  // Pages
  addProcedureTitle: 'Adicionar Procedimento',
  editProcedureTitle: 'Editar Procedimento',
  deleteProcedure: 'Excluir Procedimento',
  deleteConfirm: 'Excluir este procedimento?',
  deleteFailed: 'Falha ao excluir. Tente novamente.',
  // Settings
  settingsTitle: 'Configurações',
  changePinTitle: 'Alterar PIN',
  currentPin: 'PIN atual',
  newPin: 'Novo PIN',
  confirmNewPin: 'Confirmar novo PIN',
  currentPinIncorrect: 'PIN atual incorreto',
  newPinTooShort: 'O novo PIN deve ter pelo menos 4 caracteres',
  newPinMismatch: 'Os novos PINs não coincidem',
  pinChanged: 'PIN alterado com sucesso.',
  changePinButton: 'Alterar PIN',
  changePinFailed: 'Falha ao alterar o PIN. Tente novamente.',
  languageLabel: 'Idioma',
  languageEn: 'English',
  languagePtBR: 'Português (Brasil)',
  snooze: 'Adiar 3 dias', statusSnoozed: 'Adiado',
  sectionOverdue: 'Em atraso', sectionToday: 'Hoje', sectionThisWeek: 'Esta semana',
  sectionUpcoming: 'Próximos', sectionEmpty: 'Nenhum lembrete de cobrança pendente.',
  overdueLabel: 'Em atraso', dueTodayLabel: 'Vence hoje', thisWeekLabel: 'Esta semana',
  remindInLabel: 'Lembrar em', reminderDateLabel: 'Data do lembrete', daysLabel: 'dias',
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
}

export const translations: Record<Language, Translations> = { en, 'pt-BR': ptBR }

export type TranslationKey = keyof Translations
