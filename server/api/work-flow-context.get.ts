import { getWorkFlowEditorContext } from '#server/utils/workFlowContext'

export default defineEventHandler(() => createResponse(getWorkFlowEditorContext()))
