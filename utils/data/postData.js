

export let posts = [
    {
        id: 1,
        username: "kaushal",
        content: "Creating a blog page using HTML, CSS, and JavaScript requires planning and structure. Begin with a basic HTML layout including a header, navigation bar, main content area, and footer. Style the layout using CSS to ensure it’s visually appealing and responsive. JavaScript can be used to add interactive elements like modals, dark mode, or real-time comments. You can also use frameworks like React or Vue for dynamic blog components. If you want to include a backend, use Node.js with Express and a MongoDB database to store and manage blog posts. Deploy the blog using platforms like Vercel or Netlify."
    },
    {
        id: 2,
        username: "priya",
        content: "Centering a div in CSS is one of the most commonly asked questions. You can center a div horizontally by setting the margin to `auto` and giving it a specific width. For vertical centering, using Flexbox is the easiest way. Set the parent container to `display: flex`, and then use `justify-content: center` and `align-items: center` to center the child div both horizontally and vertically. Alternatively, CSS Grid also offers powerful centering options. Just define the grid and use `place-items: center`. These methods make responsive and adaptive designs much easier to manage in modern web development."
    },
    {
        id: 3,
        username: "arjun",
        content: "Learning React in 2025 has become easier due to the availability of many free and paid resources. Websites like freeCodeCamp, Codecademy, and Scrimba offer interactive tutorials. YouTube channels like 'Codevolution' and 'The Net Ninja' provide in-depth tutorials with projects. For structured learning, courses on Udemy or Coursera are highly recommended. Additionally, reading the official React documentation is essential, as it is frequently updated and maintained by the React team. Practice by building small projects such as a todo app, weather app, or blog. Stay updated with the latest features like hooks and concurrent rendering for best results."
    },
    {
        id: 4,
        username: "mohit",
        content: "Understanding the difference between `let`, `const`, and `var` in JavaScript is crucial for writing efficient code. `var` is function-scoped and can be re-declared, but it is outdated and has hoisting issues. `let` and `const` were introduced in ES6 and are block-scoped. `let` allows you to reassign values, while `const` is used for constants that don’t change, although objects declared with `const` can have their properties modified. It is best practice to use `const` by default and only use `let` when reassignment is necessary. Avoid using `var` in modern development to prevent scope-related bugs and issues."
    },
    {
        id: 5,
        username: "riya",
        content: "Fetching API data in React using `useEffect` is a common pattern. The `useEffect` hook lets you perform side effects like data fetching, subscriptions, or manually changing the DOM. To fetch data, use the `fetch` API or a library like Axios inside `useEffect`, and update the component’s state using `useState`. Always include an empty dependency array to make the fetch call only once after the initial render. Consider error handling, loading states, and aborting requests using `AbortController`. This approach ensures your app remains performant and user-friendly. For complex fetching logic, you can use tools like React Query or SWR."
    },
    
];
