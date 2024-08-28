# Admin UI Docs

**Documentation for AdminJS Usage**

## Custom Components

### Setup

To achieve this, we need to create a file that will contain our custom components. In our case, it is `components.ts` located at this path:

`admin/src/components/components.ts`

Here we create a single `componentLoader` for the entire application:

```typescript
import { ComponentLoader } from "adminjs";
export const componentLoader = new ComponentLoader();
```

It is essential for loading and creating our components.

Next, we need to add it to the configuration file. In our case, it is `app.ts`, located at this path:

`admin/src/config/app.ts`

Inside AdminJS, we place our loader:

```typescript
new AdminJS({
  resources: [SomeResource],
  componentLoader,
});
```

And below AdminJS, it is necessary to add this line:

```typescript
admin.watch();
```

### Custom Components - Example

```typescript
import React from "react";

const CustomComponent = (props) => {
console.log(props)
return <div>CustomComponent</div>;
};

export default CustomComponent;
```

Props are passed automatically depending on the usage of the component, details below.
An `export default` is required when creating custom components in AdminJS.

### Custom Components - Add

The `add` function is used to register your own component, allowing it to be used in specific locations. For example, in the file where you have `componentLoader`, you should add and export it like this:

```typescript
export const Components = {
  CustomComponent: componentLoader.add(
    "CustomComponent",
    "path/to/CustomComponent",
  ),
};
```

**Use Example:**

All columns in the User table defined in admin/src/AdminResourceOptions/users have a components property like so:

```typescript
first_name: {
  components: {
    list: SingleTableReplace,
    edit: SingleDataEditFormReplace,
    show: SingleDataPreviewReplace
  }
}
```

In AdminJS, these keys mean:
• **list** - This represents the field in the table view.
• **edit** - This is the individual input field in the data edit form.
• **show** - This is the individual element in the data preview.enough paste

To use a custom component, simply assign `Components.CustomComponent` to one of these keys, like so:

```typescript
export { Components } from "path/to/Components";
first_name: {
  components: {
    edit: Components.CustomComponent;
  }
}
```

In this example, the props in CustomComponent will contain information about the entire row, not just the first_name field. This means that all potential fields available for editing will be included, not only the specific field tied to the component. I understand this seem a bit unintuitive However, you can extract the necessary information with code like this:

```typescript
import React from "react";

const CustomComponent = (props) => {
const { name } = props?.property;
const value = props?.record?.params[name]

return <div>CustomComponent</div>;
};

export default CustomComponent;
```

This way, we get the value we need. Additionally, the props also include an onChange function. With these, our fully functional code might look like this:

```typescript
import React from "react";

const CustomComponent = ({ property, record, onChange }) => {
const { name } = property;
const value = record?.params[name] || "";

return (
		<Input
			onChange={(e) => onChange(name, e.target.value)}
			value={value}
		/>;
	)
};

export default CustomComponent;
```

This way, you can easily replace the default component with your custom one for a specific view.

### Custom Components - override

`override` is used for globally overriding a default component.

**Saving:**

```typescript
componentLoader.override("ComponentName", "path/to/CustomComponent");
```

It is loaded automatically.

Components that are added (depending on where we use them) or overridden have all variables passed by default in props. To check them, you can simply use

```typescript
console.log(props);
```

or refer to this [file](https://github.com/SoftwareBrothers/adminjs/tree/master/src/frontend/components/app).

## Links & Paths

1.  **Overridable Components List**

You can find a [list of all components](https://github.com/SoftwareBrothers/adminjs/blob/master/src/frontend/utils/overridable-component.ts) that can be overridden using the `override` function in AdminJS. This is a handy reference to see which components can be customized.

2.  **AdminJS Function Descriptions and Props**

For detailed descriptions and possible props of all AdminJS functions, navigate to the following file path when in the root of your project:

`node_modules/.pnpm/adminjs@7.8.11_@types+babel__core@7.20.5_@types+react-dom@18.2.19_@types+react@18.3.3/node_modules/adminjs/types/src/index.d.ts` This file contains all the props and keywords related to AdminJS.

- **VSCode**: Press `Ctrl/Cmd + P` and paste the above path to quickly navigate to the file.

3.  **Design System Documentation**

Check out the [Design System Documentation](https://storybook.adminjs.co/?path=/docs/designsystem-atoms-table--docs) to explore the design system and its components. This documentation provides detailed information on how to use and customize the design system's atoms, molecules, and organisms.

4.  **Default Components Source Code**

The entire [app folder](https://github.com/SoftwareBrothers/adminjs/tree/master/src/frontend/components/app) contains the source code of the default components in AdminJS. This is an excellent starting point for customizing components, as it includes all the props used by each component.
