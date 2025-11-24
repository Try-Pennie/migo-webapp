'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import TemplateVarPanel, { PanelTitle, VarOpBtnGroup } from '../value-panel'
import FileUploaderInAttachmentWrapper from '../base/file-uploader-in-attachment'
import s from './style.module.css'
import { AppInfoComp, ChatBtn, FootLogo, PromptTemplate } from './massive-component'
import type { AppInfo, PromptConfig } from '@/types/app'
import Toast from '@/app/components/base/toast'
import Select from '@/app/components/base/select'
import { DEFAULT_VALUE_MAX_LEN } from '@/config'

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

export interface IWelcomeProps {
  conversationName: string
  hasSetInputs: boolean
  isPublicVersion: boolean
  siteInfo: AppInfo
  promptConfig: PromptConfig
  onStartChat: (inputs: Record<string, any>) => void
  canEditInputs: boolean
  savedInputs: Record<string, any>
  onInputsChange: (inputs: Record<string, any>) => void
  onClose?: () => void
}

const Welcome: FC<IWelcomeProps> = ({
  conversationName,
  hasSetInputs,
  isPublicVersion,
  siteInfo,
  promptConfig,
  onStartChat,
  canEditInputs,
  savedInputs,
  onInputsChange,
  onClose,
}) => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const sfdcLeadId = searchParams.get('sfdc_lead_id')
  const hasVar = promptConfig.prompt_variables.length > 0
  const [isFold, setIsFold] = useState<boolean>(true)
  const [inputs, setInputs] = useState<Record<string, any>>((() => {
    if (hasSetInputs) { return savedInputs }

    const res: Record<string, any> = {}
    if (promptConfig) {
      promptConfig.prompt_variables.forEach((item) => {
        if (item.key === 'sfdc_lead_id' && sfdcLeadId) {
          res[item.key] = sfdcLeadId
        } else {
          res[item.key] = ''
        }
      })
    }
    return res
  })())
  useEffect(() => {
    if (!savedInputs) {
      const res: Record<string, any> = {}
      if (promptConfig) {
        promptConfig.prompt_variables.forEach((item) => {
          if (item.key === 'sfdc_lead_id' && sfdcLeadId) {
            res[item.key] = sfdcLeadId
          } else {
            res[item.key] = ''
          }
        })
      }
      setInputs(res)
    }
    else {
      setInputs(savedInputs)
    }
  }, [savedInputs, sfdcLeadId])

  const highLightPromoptTemplate = (() => {
    if (!promptConfig) { return '' }
    const res = promptConfig.prompt_template.replace(regex, (match, p1) => {
      return `<span class='text-gray-800 font-bold'>${inputs?.[p1] ? inputs?.[p1] : match}</span>`
    })
    return res
  })()

  const { notify } = Toast
  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const renderHeader = () => {
    return (
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between border-b border-gray-100 mobile:h-12 tablet:h-16 px-8 bg-white'>
        <div className='text-gray-900'>{conversationName}</div>
      </div>
    )
  }

  const renderInputs = () => {
    return (
      <div className='space-y-3'>
        {promptConfig.prompt_variables.map((item) => {
          if (item.key === 'sfdc_lead_id' || item.key === 'custom_context')
            return null
          return (
            <div className='tablet:flex items-start mobile:space-y-2 tablet:space-y-0 mobile:text-xs tablet:text-sm' key={item.key}>
              <label className={`flex-shrink-0 flex items-center tablet:leading-9 mobile:text-gray-700 tablet:text-gray-900 mobile:font-medium pc:font-normal ${s.formLabel}`}>{item.name}</label>
              {item.type === 'select'
                && (
                  <Select
                    className='w-full'
                    defaultValue={inputs?.[item.key]}
                    onSelect={(i) => { setInputs({ ...inputs, [item.key]: i.value }) }}
                    items={(item.options || []).map(i => ({ name: i, value: i }))}
                    allowSearch={false}
                    bgClassName='bg-gray-50'
                  />
                )}
              {item.type === 'string' && (
                <input
                  placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
                  value={inputs?.[item.key] || ''}
                  onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
                  className={'w-full flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50'}
                  maxLength={item.max_length || DEFAULT_VALUE_MAX_LEN}
                />
              )}
              {item.type === 'paragraph' && (
                <textarea
                  className="w-full h-[104px] flex-grow py-2 pl-3 pr-3 box-border rounded-lg bg-gray-50"
                  placeholder={`${item.name}${!item.required ? `(${t('app.variableTable.optional')})` : ''}`}
                  value={inputs?.[item.key] || ''}
                  onChange={(e) => { setInputs({ ...inputs, [item.key]: e.target.value }) }}
                />
              )}
              {item.type === 'number' && (
                <input
                  type="number"
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 "
                  placeholder={`${item.name}${!item.required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
                  value={inputs[item.key]}
                  onChange={(e) => { onInputsChange({ ...inputs, [item.key]: e.target.value }) }}
                />
              )}

              {
                item.type === 'file' && (
                  <FileUploaderInAttachmentWrapper
                    fileConfig={{
                      allowed_file_types: item.allowed_file_types,
                      allowed_file_extensions: item.allowed_file_extensions,
                      allowed_file_upload_methods: item.allowed_file_upload_methods!,
                      number_limits: 1,
                      fileUploadConfig: {} as any,
                    }}
                    onChange={(files) => {
                      setInputs({ ...inputs, [item.key]: files[0] })
                    }}
                    value={inputs?.[item.key] || []}
                  />
                )
              }
              {
                item.type === 'file-list' && (
                  <FileUploaderInAttachmentWrapper
                    fileConfig={{
                      allowed_file_types: item.allowed_file_types,
                      allowed_file_extensions: item.allowed_file_extensions,
                      allowed_file_upload_methods: item.allowed_file_upload_methods!,
                      number_limits: item.max_length,
                      fileUploadConfig: {} as any,
                    }}
                    onChange={(files) => {
                      setInputs({ ...inputs, [item.key]: files })
                    }}
                    value={inputs?.[item.key] || []}
                  />
                )
              }
            </div>
          )
        })}
      </div>
    )
  }

  const canChat = () => {
    const inputLens = Object.values(inputs).length
    const promptVariablesLens = promptConfig.prompt_variables.length
    const emptyInput = inputLens < promptVariablesLens || Object.entries(inputs).filter(([k, v]) => {
      const isRequired = promptConfig.prompt_variables.find(item => item.key === k)?.required ?? true
      return isRequired && v === ''
    }).length > 0
    if (emptyInput) {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  const handleChat = () => {
    if (!canChat()) { return }

    onStartChat(inputs)
  }

  const renderNoVarPanel = () => {
    if (isPublicVersion) {
      return (
        <div>
          <AppInfoComp siteInfo={siteInfo} />
          <TemplateVarPanel
            isFold={false}
            header={
              <>
                <PanelTitle
                  title={t('app.chat.publicPromptConfigTitle')}
                  className='mb-1'
                />
                <PromptTemplate html={highLightPromoptTemplate} />
              </>
            }
          >
            <ChatBtn onClick={handleChat} />
          </TemplateVarPanel>
        </div>
      )
    }
    // private version
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        <ChatBtn onClick={handleChat} />
      </TemplateVarPanel>
    )
  }

  const renderVarPanel = () => {
    return (
      <TemplateVarPanel
        isFold={false}
        header={
          <AppInfoComp siteInfo={siteInfo} />
        }
      >
        {renderInputs()}
        <ChatBtn
          className='mt-3 mobile:ml-0 tablet:ml-[128px]'
          onClick={handleChat}
        />
      </TemplateVarPanel>
    )
  }

  const renderVarOpBtnGroup = () => {
    return (
      <VarOpBtnGroup
        onConfirm={() => {
          if (!canChat()) { return }

          onInputsChange(inputs)
          setIsFold(true)
        }}
        onCancel={() => {
          setInputs(savedInputs)
          setIsFold(true)
        }}
      />
    )
  }

  const renderHasSetInputsPublic = () => {
    if (!canEditInputs) {
      return (
        <TemplateVarPanel
          isFold={false}
          header={
            <>
              <PanelTitle
                title={t('app.chat.publicPromptConfigTitle')}
                className='mb-1'
              />
              <PromptTemplate html={highLightPromoptTemplate} />
            </>
          }
        />
      )
    }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <>
            <PanelTitle
              title={t('app.chat.publicPromptConfigTitle')}
              className='mb-1'
            />
            <PromptTemplate html={highLightPromoptTemplate} />
          </>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputsPrivate = () => {
    if (!canEditInputs || !hasVar) { return null }

    return (
      <TemplateVarPanel
        isFold={isFold}
        header={
          <div className='flex items-center justify-between text-indigo-600'>
            <PanelTitle
              title={t('app.chat.privatePromptConfigTitle')}
            />
          </div>
        }
      >
        {renderInputs()}
        {renderVarOpBtnGroup()}
      </TemplateVarPanel>
    )
  }

  const renderHasSetInputs = () => {
    if ((!isPublicVersion && !canEditInputs) || !hasVar) { return null }

    return (
      <div
        className='pt-[88px] mb-5'
      >
        {isPublicVersion ? renderHasSetInputsPublic() : renderHasSetInputsPrivate()}
      </div>)
  }

  const renderMigoWelcome = () => {
    return (
      <div className={s.migoContainer}>
        {onClose && (
          <div className="absolute top-4 right-4 cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors" onClick={onClose}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
               <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
             </svg>
          </div>
        )}
        <div className="text-center mb-8">
          <div className={s.migoLogo}></div>
          <h1 className="text-white text-3xl font-bold mt-4">Hi, I&apos;m Migo!</h1>
          <p className="text-white text-xl mt-2">Your automated AI financial advisor</p>
        </div>

        <div className={s.migoCard}>
          <h2 className="text-gray-900 font-bold text-lg mb-2">Start new conversation</h2>
          <p className="text-gray-500 text-sm mb-6">Ask any question. I&apos;ll help you make sense of financial analysis.</p>
          <button
            className={s.migoButton}
            onClick={() => onStartChat(inputs)}
          >
            Send message
          </button>
        </div>
      </div>
    )
  }

  if (!hasSetInputs) {
    return renderMigoWelcome()
  }

  return (
    <div className='relative mobile:min-h-[48px] tablet:min-h-[64px]'>
      {hasSetInputs && renderHeader()}
      <div className='mx-auto pc:w-[794px] max-w-full mobile:w-full px-3.5'>
        {/* Has set inputs */}
      </div>
    </div >
  )
}

export default React.memo(Welcome)
