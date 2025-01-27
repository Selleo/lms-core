export const defaultClasses = {
  ul: `
      [&>div>ul]:list-disc
      [&>div>ul]:pl-5
      [&>div>ul>li>p]:inline
      [&>div>ul>li>p]:text-neutral-900

      [&_ul]:list-disc
      [&_[contenteditable='true']>ul>li]:pl-0
      [&_[contenteditable='true']>ul>li_ul_li]:pl-0
      [&_[contenteditable='false']>ul>li]:pl-4
      [&_[contenteditable='false']>ul>li_ul_li]:pl-4
      [&_ul>li]:marker:text-neutral-400
      [&_ul>li>p]:inline
      [&_ul>li>p]:text-neutral-900
    `,
  ol: `
      [&>div>ol]:list-decimal
      [&>div>ol]:list-inside
      [&>div>ol>li>p]:inline
      [&>div>ol>li>ol]:pl-4
      [&_ol>li>ol]:pl-4
    `,
  taskList: "[&_[data-type='taskList']]:list-none [&_[data-type='taskList']]:pl-0",
};
