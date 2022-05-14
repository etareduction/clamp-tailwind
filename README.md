## **WARNING!** Currently it overwrites source files, that's intentional. Make sure to save backups!

### How it works:

- Install the CLI tool from NPM registry:
    ```bash
    npm i -g clamp-tailwind
    ```

- Run it providing path to directory that contains `.tsx` source files:
    ```bash
    clamp-tailwind path/to/directory
    ```
- Such input source code:
    ```tsx 
    // Button.tsx
  
    import type { FC } from 'react'
    
    const Button: FC = () => <div className='w-10 h-10 bg-red-900' />
    
    export default Button
    ```
    Will result in such output:
    ```tsx
    // Button.tsx
  
    import styles from './Button.module.css'
    import type { FC } from 'react'
    
    const Button: FC = () => <div className={styles['div']} />
    
    export default Button 
    ```
    ```css
    /* Button.module.css */
  
    .div {
        @apply w-10 h-10 bg-red-900;
    }
    ```
---

Jest tests included:
```bash
npm test
```
