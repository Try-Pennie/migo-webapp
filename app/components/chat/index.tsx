'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'
import FileUploaderInAttachmentWrapper from '@/app/components/base/file-uploader-in-attachment'
import type { FileEntity, FileUpload } from '@/app/components/base/file-uploader-in-attachment/types'
import { getProcessedFiles } from '@/app/components/base/file-uploader-in-attachment/utils'
import { PaperClipIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export interface IChatProps {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  fileConfig?: FileUpload
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  fileConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const [attachmentFiles, setAttachmentFiles] = React.useState<FileEntity[]>([])

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend())) { return }
    const imageFiles: VisionFile[] = files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    }))
    const docAndOtherFiles: VisionFile[] = getProcessedFiles(attachmentFiles)
    const combinedFiles: VisionFile[] = [...imageFiles, ...docAndOtherFiles]
    onSend(queryRef.current, combinedFiles)
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length) { onClear() }
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
    if (!attachmentFiles.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)) { setAttachmentFiles([]) }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current) { handleSend() }
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className={cn(!feedbackDisabled && 'px-3.5', 'h-full flex flex-col')}>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto pb-[140px]">
        {/* Date Separator */}
        <div className="flex justify-center py-6">
           <span className="text-xs text-gray-500 font-medium">Monday, 10 November</span>
        </div>

        <div className="space-y-[20px]">
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return <Answer
                key={item.id}
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && isLast}
                suggestionClick={suggestionClick}
              />
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
                item={item}
              />
            )
          })}
        </div>
      </div>
      
      {
        !isHideSendInput && (
          <div className='fixed z-10 bottom-0 left-0 w-full pb-6 px-4'>
             <div className="max-w-[800px] mx-auto">
                 {/* Handle File/Image Upload Previews if any */}
                 {(visionConfig?.enabled && files.length > 0) || (fileConfig?.enabled && attachmentFiles.length > 0) ? (
                    <div className="mb-2 bg-white rounded-xl p-2 border border-gray-200 shadow-sm">
                        {visionConfig?.enabled && files.length > 0 && (
                             <ImageList
                                list={files}
                                onRemove={onRemove}
                                onReUpload={onReUpload}
                                onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                                onImageLinkLoadError={onImageLinkLoadError}
                             />
                        )}
                        {fileConfig?.enabled && (
                            <FileUploaderInAttachmentWrapper
                                fileConfig={fileConfig}
                                value={attachmentFiles}
                                onChange={setAttachmentFiles}
                            />
                        )}
                    </div>
                 ) : null}

                <div className='relative flex items-center w-full bg-white rounded-full border border-gray-200 shadow-lg px-2 py-2'>
                     {/* Paperclip / Upload Trigger */}
                    <div className="flex-shrink-0 p-2 cursor-pointer text-gray-400 hover:text-gray-600 relative">
                         <PaperClipIcon className="w-6 h-6" />
                         {/* Re-enable upload functionality using opacity 0 if needed, or just keep visual for now */}
                         {visionConfig?.enabled && (
                            <div className="absolute inset-0 opacity-0">
                                <ChatImageUploader
                                    settings={visionConfig}
                                    onUpload={onUpload}
                                    disabled={files.length >= visionConfig.number_limits}
                                />
                            </div>
                         )}
                    </div>
                    
                    {/* Input */}
                    <Textarea
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 px-3 py-1 text-base resize-none max-h-[120px]"
                        placeholder="Ask me anything"
                        value={query}
                        onChange={handleContentChange}
                        onKeyUp={handleKeyUp}
                        onKeyDown={handleKeyDown}
                        autoSize={{ minRows: 1, maxRows: 5 }}
                    />

                     {/* Smiley */}
                    <div className="flex-shrink-0 p-2 cursor-pointer text-gray-400 hover:text-gray-600">
                         <FaceSmileIcon className="w-6 h-6" />
                    </div>

                     {/* Send Button */}
                    <div 
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ml-1 transition-colors duration-200 ${query.trim() ? 'bg-[#101828] hover:bg-gray-800' : 'bg-[#101828] opacity-100'}`}
                        onClick={handleSend}
                    >
                        <PaperAirplaneIcon className="w-5 h-5 text-white" />
                    </div>
                </div>
             </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(Chat)
