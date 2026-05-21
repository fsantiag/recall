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
}

export const translations: Record<Language, Translations> = { en, 'pt-BR': ptBR }

export type TranslationKey = keyof Translations
