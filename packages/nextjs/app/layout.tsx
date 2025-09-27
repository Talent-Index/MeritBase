import "@rainbow-me/rainbowkit/styles.css";
import { MeritBaseAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "MeritBase",
  description: "MeritBase - Decentralized Professional Identity",
});

const MeritBaseApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={``}>
      <body>
        <ThemeProvider enableSystem>
          <MeritBaseAppWithProviders>{children}</MeritBaseAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default MeritBaseApp;
