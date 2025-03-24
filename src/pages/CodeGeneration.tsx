
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Code, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

const CodeGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [framework, setFramework] = useState('react');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate code generation
    setTimeout(() => {
      const code = generateSampleCode(language, framework, prompt);
      setGeneratedCode(code);
      setIsLoading(false);
      toast.success('Code generated successfully');
    }, 1500);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Code copied to clipboard');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Generation</h1>
          <p className="text-muted-foreground mt-2">
            Generate code snippets for various languages and frameworks using AI
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Describe what you want to build</label>
                  <Textarea 
                    placeholder="E.g., Create a React button component with hover effects and loading state"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-1/2">
                    <label className="text-sm font-medium mb-2 block">Framework</label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  className="w-full" 
                  disabled={isLoading || !prompt.trim()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoading ? 'Generating...' : 'Generate Code'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                {generatedCode && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <div className="relative bg-zinc-950 rounded-md overflow-hidden">
                {generatedCode ? (
                  <pre className="p-4 text-zinc-100 overflow-x-auto">
                    <code>{generatedCode}</code>
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
                    <Code className="h-12 w-12 mb-2 opacity-20" />
                    <p>Generated code will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper function to generate sample code based on user input
function generateSampleCode(language: string, framework: string, prompt: string): string {
  if (language === 'javascript' || language === 'typescript') {
    if (framework === 'react') {
      return `import React, { useState } from 'react';

const Button = ({ children, onClick, variant = 'primary', isLoading = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = 'px-4 py-2 rounded font-medium transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${isLoading ? 'opacity-70 cursor-not-allowed' : ''}\`}
      onClick={isLoading ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;`;
    } else if (framework === 'vue') {
      return `<template>
  <button 
    :class="[
      'button', 
      \`button--\${variant}\`, 
      { 'button--loading': isLoading }
    ]"
    :disabled="isLoading"
    @click="isLoading ? undefined : onClick"
  >
    <span v-if="isLoading" class="button__loader">
      <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    </span>
    <slot v-else></slot>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'danger'].includes(value)
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.button--primary {
  background-color: #2563eb;
  color: white;
}

.button--primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.button--secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.button--secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

.button--danger {
  background-color: #dc2626;
  color: white;
}

.button--danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

.button--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.button__loader {
  display: flex;
  align-items: center;
}
</style>`;
    } else {
      return `// A vanilla JavaScript button with hover effects and loading state

class Button {
  constructor(selector, options = {}) {
    this.element = document.querySelector(selector);
    if (!this.element) throw new Error(\`Button element "\${selector}" not found\`);
    
    this.options = {
      variant: 'primary',
      loadingText: 'Loading...',
      ...options
    };
    
    this.isLoading = false;
    this.originalText = this.element.textContent;
    this.init();
  }
  
  init() {
    // Add base styling
    this.element.classList.add('button');
    this.element.classList.add(\`button--\${this.options.variant}\`);
    
    // Add event listeners
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleMouseEnter() {
    if (this.isLoading) return;
    this.element.classList.add('button--hovered');
  }
  
  handleMouseLeave() {
    this.element.classList.remove('button--hovered');
  }
  
  handleClick(event) {
    if (this.isLoading) {
      event.preventDefault();
      return;
    }
    
    if (this.options.onClick) {
      this.options.onClick(event);
    }
  }
  
  setLoading(isLoading) {
    this.isLoading = isLoading;
    
    if (isLoading) {
      this.element.classList.add('button--loading');
      this.element.setAttribute('disabled', 'disabled');
      this.element.innerHTML = \`
        <svg class="button__spinner" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle class="spinner__background" cx="12" cy="12" r="10" />
          <circle class="spinner__foreground" cx="12" cy="12" r="10" />
        </svg>
        \${this.options.loadingText}
      \`;
    } else {
      this.element.classList.remove('button--loading');
      this.element.removeAttribute('disabled');
      this.element.textContent = this.originalText;
    }
  }
}

// CSS to add to your stylesheet
const styles = \`
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.button--primary {
  background-color: #2563eb;
  color: white;
}

.button--primary.button--hovered {
  background-color: #1d4ed8;
}

.button--secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.button--secondary.button--hovered {
  background-color: #d1d5db;
}

.button--danger {
  background-color: #dc2626;
  color: white;
}

.button--danger.button--hovered {
  background-color: #b91c1c;
}

.button--loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.button__spinner {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
}

.spinner__background {
  fill: none;
  stroke: currentColor;
  opacity: 0.25;
  stroke-width: 4;
}

.spinner__foreground {
  fill: none;
  stroke: currentColor;
  opacity: 0.75;
  stroke-width: 4;
  stroke-dasharray: 60;
  stroke-dashoffset: 45;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
\`;

// Usage
const button = new Button('#my-button', {
  variant: 'primary',
  loadingText: 'Processing...',
  onClick: (event) => {
    button.setLoading(true);
    // Simulate async operation
    setTimeout(() => {
      button.setLoading(false);
    }, 2000);
  }
});
`;
    }
  } else if (language === 'python') {
    return `# Python implementation based on the prompt: "${prompt}"

class Button:
    """A simple button class with state management."""
    
    def __init__(self, label, action=None, variant="primary"):
        """
        Initialize a new button.
        
        Args:
            label (str): The text to display on the button.
            action (callable, optional): Function to call when button is clicked.
            variant (str): Button style - 'primary', 'secondary', or 'danger'.
        """
        self.label = label
        self.action = action
        self.variant = variant
        self.is_loading = False
        self.is_hovered = False
        
    def click(self):
        """Handle button click."""
        if self.is_loading:
            print(f"Button '{self.label}' is currently loading...")
            return
            
        print(f"Button '{self.label}' was clicked!")
        if self.action:
            return self.action()
    
    def set_loading(self, is_loading):
        """Set the loading state of the button."""
        self.is_loading = is_loading
        state = "Loading..." if is_loading else "Ready"
        print(f"Button '{self.label}' state: {state}")
        
    def hover(self, is_hovered):
        """Handle hover state change."""
        self.is_hovered = is_hovered
        action = "entered" if is_hovered else "left"
        print(f"Mouse {action} button '{self.label}'")
        
    def render(self):
        """Render the button (text representation)."""
        base = "[ "
        
        # Show loading spinner or label
        if self.is_loading:
            content = "● Loading..."
        else:
            content = self.label
            
        # Style based on variant
        if self.variant == "primary":
            style = "BLUE: "
        elif self.variant == "secondary":
            style = "GRAY: "
        elif self.variant == "danger":
            style = "RED: "
        else:
            style = ""
            
        # Add hover effect
        if self.is_hovered and not self.is_loading:
            style += "(hovered) "
            
        return base + style + content + " ]"


# Example usage
def example_action():
    print("Performing example action...")
    # Simulate async process
    import time
    time.sleep(1.5)
    print("Action complete!")
    
# Create a button instance
submit_button = Button("Submit", action=example_action, variant="primary")

# Test button states
print(submit_button.render())  # Initial state

submit_button.hover(True)
print(submit_button.render())  # Hovered state

submit_button.set_loading(True)
print(submit_button.render())  # Loading state

# This won't call the action since button is loading
submit_button.click()

submit_button.set_loading(False)
print(submit_button.render())  # Ready state

# Now the action will execute
submit_button.click()
`;
  } else if (language === 'java') {
    return `import java.util.function.Consumer;

/**
 * A Button class with hover effects and loading state
 */
public class Button {
    private String text;
    private String variant;
    private boolean isLoading;
    private boolean isHovered;
    private Runnable onClick;
    
    /**
     * Constructs a new Button with the specified text and default styling.
     * 
     * @param text the button text
     */
    public Button(String text) {
        this(text, "primary", null);
    }
    
    /**
     * Constructs a new Button with specified text and styling.
     * 
     * @param text the button text
     * @param variant the button style variant (primary, secondary, danger)
     * @param onClick the action to perform on click
     */
    public Button(String text, String variant, Runnable onClick) {
        this.text = text;
        this.variant = variant;
        this.onClick = onClick;
        this.isLoading = false;
        this.isHovered = false;
    }
    
    /**
     * Sets the loading state of the button.
     * 
     * @param loading true if the button should show loading state
     */
    public void setLoading(boolean loading) {
        this.isLoading = loading;
        render(); // Refresh button appearance
    }
    
    /**
     * Updates hover state when mouse enters the button.
     */
    public void onMouseEnter() {
        this.isHovered = true;
        render(); // Refresh button appearance
    }
    
    /**
     * Updates hover state when mouse leaves the button.
     */
    public void onMouseLeave() {
        this.isHovered = false;
        render(); // Refresh button appearance
    }
    
    /**
     * Handles click events on the button.
     */
    public void click() {
        if (isLoading) {
            System.out.println("Button is loading, ignoring click");
            return;
        }
        
        System.out.println("Button clicked: " + text);
        if (onClick != null) {
            onClick.run();
        }
    }
    
    /**
     * Renders the button by returning its string representation.
     * (In a real UI framework, this would update the visual component)
     */
    public String render() {
        StringBuilder sb = new StringBuilder();
        
        // Apply base style
        sb.append("Button[");
        
        // Apply variant style
        switch (variant) {
            case "primary":
                sb.append("Primary");
                break;
            case "secondary":
                sb.append("Secondary");
                break;
            case "danger":
                sb.append("Danger");
                break;
            default:
                sb.append("Default");
        }
        
        // Apply hover effect
        if (isHovered && !isLoading) {
            sb.append(":Hovered");
        }
        
        sb.append("]: ");
        
        // Show loading state or text
        if (isLoading) {
            sb.append("Loading...");
        } else {
            sb.append(text);
        }
        
        String rendered = sb.toString();
        System.out.println(rendered);
        return rendered;
    }
    
    /**
     * Example usage of the Button class.
     */
    public static void main(String[] args) {
        // Create a button with click handler
        Button submitButton = new Button("Submit", "primary", () -> {
            System.out.println("Performing submit action...");
            
            // In a real app, we'd handle async operations properly
            new Thread(() -> {
                try {
                    // Simulate some work
                    Thread.sleep(2000);
                    System.out.println("Submit action completed");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        });
        
        // Render initial state
        submitButton.render();
        
        // Test hover
        submitButton.onMouseEnter();
        
        // Test loading state
        submitButton.setLoading(true);
        
        // This click will be ignored
        submitButton.click();
        
        // Done loading
        submitButton.setLoading(false);
        
        // This click will work
        submitButton.click();
        
        // Test mouse leave
        submitButton.onMouseLeave();
    }
}
`;
  } else if (language === 'csharp') {
    return `using System;
using System.Threading.Tasks;

namespace ButtonExample
{
    /// <summary>
    /// A button component with hover effects and loading state.
    /// </summary>
    public class Button
    {
        private string _text;
        private string _variant;
        private bool _isLoading;
        private bool _isHovered;
        private Action _onClick;

        /// <summary>
        /// Gets the text displayed on the button.
        /// </summary>
        public string Text => _isLoading ? "Loading..." : _text;

        /// <summary>
        /// Gets or sets whether the button is in a loading state.
        /// </summary>
        public bool IsLoading
        {
            get => _isLoading;
            set
            {
                _isLoading = value;
                OnPropertyChanged(nameof(IsLoading));
                OnPropertyChanged(nameof(Text));
                OnPropertyChanged(nameof(IsEnabled));
            }
        }

        /// <summary>
        /// Gets whether the button is enabled.
        /// </summary>
        public bool IsEnabled => !_isLoading;

        /// <summary>
        /// Creates a new button with the specified text and default styling.
        /// </summary>
        /// <param name="text">The text to display on the button.</param>
        public Button(string text) : this(text, "primary", null)
        {
        }

        /// <summary>
        /// Creates a new button with the specified text, styling, and click handler.
        /// </summary>
        /// <param name="text">The text to display on the button.</param>
        /// <param name="variant">The style variant (primary, secondary, danger).</param>
        /// <param name="onClick">The action to perform when clicked.</param>
        public Button(string text, string variant, Action onClick)
        {
            _text = text ?? throw new ArgumentNullException(nameof(text));
            _variant = variant ?? "primary";
            _onClick = onClick;
            _isLoading = false;
            _isHovered = false;
        }

        /// <summary>
        /// Handles mouse enter events.
        /// </summary>
        public void OnMouseEnter()
        {
            _isHovered = true;
            OnPropertyChanged(nameof(IsHovered));
        }

        /// <summary>
        /// Handles mouse leave events.
        /// </summary>
        public void OnMouseLeave()
        {
            _isHovered = false;
            OnPropertyChanged(nameof(IsHovered));
        }

        /// <summary>
        /// Gets whether the button is currently being hovered.
        /// </summary>
        public bool IsHovered => _isHovered;

        /// <summary>
        /// Handles click events.
        /// </summary>
        public void Click()
        {
            if (_isLoading)
            {
                Console.WriteLine("Button is in loading state. Click ignored.");
                return;
            }

            Console.WriteLine($"Button '{_text}' clicked.");
            _onClick?.Invoke();
        }

        /// <summary>
        /// Begins an asynchronous operation when the button is clicked.
        /// </summary>
        /// <param name="asyncAction">The asynchronous operation to perform.</param>
        public async Task ClickAsync(Func<Task> asyncAction)
        {
            if (_isLoading || asyncAction == null)
                return;

            try
            {
                IsLoading = true;
                await asyncAction();
            }
            finally
            {
                IsLoading = false;
            }
        }

        // In a real UI framework, this would update the UI
        protected virtual void OnPropertyChanged(string propertyName)
        {
            Console.WriteLine($"Property changed: {propertyName}");
        }

        /// <summary>
        /// Gets the CSS class names for the button based on its current state.
        /// </summary>
        public string GetCssClasses()
        {
            string baseClasses = "button";
            
            // Add variant
            baseClasses += $" button--{_variant}";
            
            // Add loading state
            if (_isLoading)
            {
                baseClasses += " button--loading";
            }
            
            // Add hover state
            if (_isHovered && !_isLoading)
            {
                baseClasses += " button--hover";
            }
            
            return baseClasses;
        }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            // Create a button
            var button = new Button("Submit", "primary", () => 
                Console.WriteLine("Button action executed!"));
            
            // Show initial state
            Console.WriteLine($"Button created: {button.Text}");
            Console.WriteLine($"CSS classes: {button.GetCssClasses()}");
            
            // Test hover state
            button.OnMouseEnter();
            Console.WriteLine($"Hovered CSS classes: {button.GetCssClasses()}");
            
            // Test async click
            await button.ClickAsync(async () => {
                Console.WriteLine("Starting async operation...");
                await Task.Delay(2000); // Simulate work
                Console.WriteLine("Async operation completed.");
            });
            
            // Back to normal state
            button.OnMouseLeave();
            Console.WriteLine($"Final CSS classes: {button.GetCssClasses()}");
        }
    }
}
`;
  } else {
    return `// Sample code for: ${prompt}\n// Sorry, code generation for ${language} is not implemented yet.`;
  }
}

export default CodeGeneration;
